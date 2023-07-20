import { QuickList } from "../../Base/QuickList";
import { Timer } from "../../Base/Timer";
import { EntityComponent } from "../../ECS/Factory";
import _INPUT from "../../ECS/Service/Input";
import { GameEntry } from "../../GameEntry";
import { _MATH } from "../../Utils/Math";
import { Point } from "../Map/Bstar";
import { Range } from "../Map/Range";
import { AIBase } from "./AIBase";
import { AIMove } from "./AIMove";

export class SearchMove extends AIBase {
    private static _list: QuickList<EntityComponent>;

    public timer: Timer;
    public searchRange: Range;
    public moveRange: Range;
    public intervalSection: Point;
    public _target: Point;
    public _moveAi: AIMove;
    public lockOn: boolean;
    public _hasTarget: boolean;
    public static Init() {
        let map = new Map();
        map.set("battle", true);
        map.set("transform", true);
        this._list = GameEntry.EcsMgr.NewComboList(map);
    }

    public static NewWithConfig(entity: EntityComponent, data)
    {
        return new SearchMove(entity, data);
    }

    public constructor(entity: EntityComponent, data) {
        super(entity);
        this.Init(data);

    }

    private Init(data) {
        this.searchRange = new Range(data.searchRange.xa, data.searchRange.ya, data.searchRange.xb, data.searchRange.yb);
        this.moveRange = new Range(data.moveRange.xa, data.moveRange.ya, data.moveRange.xb, data.moveRange.yb);
        this.intervalSection = new Point(data.interval.x, data.interval.y);
        this.timer = new Timer();
        this.lockOn = data.lockOn;

        this._target = new Point();
        this._moveAi = new AIMove(this.entity);
    }

    public Update(dt) {
        if (!this.CanRun()) {
            return false;
        }
        this.timer.Update(dt);

        if (!this.timer.isRunning) {
            let random = _MATH.RangeInt(this.intervalSection.x, this.intervalSection.y);
            this.timer.Enter(random);
            this.Select();

            let directionX = _MATH.RangeInt(1, 2) == 1 ? 1 : -1;
            let directionY = _MATH.RangeInt(1, 2) == 1 ? 1 : -1;

            let x = this._target.x + _MATH.RangeInt(this.moveRange.xa, this.moveRange.xb) * directionX;
            let y = this._target.y + _MATH.RangeInt(this.moveRange.ya, this.moveRange.yb) * directionY;

            this._moveAi.Tick(x, y);
        }

        this.LockOn();
        this._moveAi.Update(dt);
        return false;
    }

    public LockOn() {
        if (!this.CanRun() || !this._hasTarget || !this.lockOn) {
            return;
        }
        let direction = this.entity.transform.position.x < this._target.x ? 1 : -1;
        if (direction == this.entity.transform.direction) {
            _INPUT.Press(this.entity.input, "lockOn");
        }
    }

    public Select() {
        let hasTarget = false;
        let position1 = this.entity.transform.position;
        let pos: Point = position1;
        for (let i = 0; i < SearchMove._list.GetLength(); i++) {
            let e = SearchMove._list.Get(i);
            if (e.battle && this.entity != e) {
                let position2 = e.transform.position;
                if (this.searchRange.Collide(position1.x, position1.y, position2.x, position2.y)) {
                    pos = position2;
                    hasTarget = true;
                }
            }
        }
        this._hasTarget = hasTarget;
        this._target.Set(pos.x, pos.y);
    }
}