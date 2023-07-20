import { log } from "cc";
import _INPUT from "../../ECS/Service/Input";
import { GameEntry } from "../../GameEntry";
import { _MATH } from "../../Utils/Math";
import { Point } from "../Map/Bstar";
import { AIBase } from "./AIBase";
import { GameTime } from "../GameTime";

export class AIMove extends AIBase {
    // 上一次所在的位置
    public later: Point;
    // 寻路路径
    private _path: Point[];
    private _index: number;
    // 方向
    private _directionX: number;
    private _directionY: number;
    public constructor(entity) {
        super(entity);
        this.later = new Point();
    }

    public Update(dt) {
        if (this._path) {
            let target = this._path[this._index];
            let position = this.entity.transform.position;
            if (this._directionX != 0) {
                let key = this._directionX == 1 ? "right" : "left";
                _INPUT.Press(this.entity.input, key);
                if ((this._directionX == 1 && position.x >= target.x) || (this._directionX == -1 && position.x <= target.x)) {
                    this._directionX = 0;
                }

            }

            if (this._directionY != 0) {
                let key = this._directionY == 1 ? "down" : "up";
                _INPUT.Press(this.entity.input, key);
                if ((this._directionY == 1 && position.y >= target.y) || (this._directionY == -1 && position.y <= target.y)) {
                    this._directionY = 0;
                }

            }

            if (this._directionX == 0 && this._directionY == 0) {
                this._NextTarget();
            }
        }
        return false;
    }


    public Tick(x: number, y: number) {
        if (!this.CanRun()) {
            return false;
        }
        let matrix = GameEntry.GameMap.GetMatrix();
        if (!matrix.GetNode(x, y)) {
            let position = this.entity.transform.position;
            this._path = matrix.GetPath(position.x, position.y, x, y);
            this._index = -1;
            this._NextTarget();
        }
        return true;
    }

    private _NextTarget() {
        if (!this._path) {
            return;
        }
        if (this._index >= this._path.length - 1) {
            return;
        }
        this._index += 1;
        let position = this.entity.transform.position;
        let x = _MATH.Clamp(this._path[this._index].x, this.later.x, position.x);
        let y = _MATH.Clamp(this._path[this._index].y, this.later.y, position.y);

        if (x == this._path[this._index].x) {
            this._directionX = 0;
        }
        else {
            this._directionX = position.x < this._path[this._index].x ? 1 : -1;
        }

        if (y == this._path[this._index].y) {
            this._directionY = 0;
        }
        else {
            this._directionY = position.y < this._path[this._index].y ? 1 : -1;
        }
        log(`${this._path[this._index].y}===${this.later.y}===${position.y} 结果${y}, _directionY = ${this._directionY}`)
        this.later.Set(position.x, position.y);
    }

    public IsRunning() {
        return this._path != null;
    }

    // 目标点
    public GetTarget() {
        if (!this.IsRunning()) {
            return;
        }
        return this._path[this._path.length - 1];
    }
}