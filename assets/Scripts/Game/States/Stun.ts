import { StateBase } from "./StateBase";
import { _STATE } from "../../ECS/Service/States";
import Const from "../../Data/Const";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { Timer } from "../../Base/Timer";
import { _MATH } from "../../Utils/Math";
import { EaseMove } from "../Gear/EaseMove";
import { EntityComponent } from "../../ECS/Factory";

export class Stun extends StateBase {
    private _timer: Timer;
    private _index: number = 0;
    private _length: number = 0;
    private _easemove: EaseMove;

    public Init(entity: EntityComponent) {
        super.Init(entity);
        this._timer = new Timer();
        this._easemove = new EaseMove(this.entity.transform);
    }

    public Enter(lateState, time, power, speed, direction, flagMap): void {
        super.Enter();
        this._timer.Enter(time);
        this._length = this.frameaniSet.length;
        this._index = _MATH.RangeInt(0, this._length - 1);
        this._easemove.Enter("x", _MATH.GetFixedDecimal(power), _MATH.GetFixedDecimal(speed), direction)
        this.PlayAnimation(this._index);
    }

    public NormalUpdate(dt: number, rate: number): void {
        this._timer.Update(dt);
        this._easemove.Update(rate);
        if (!this._timer.isRunning)
        {
            _STATE.Play(this.entity.states, this.nextState);
        }
    }

    public PlayAnimation(index)
    {
        _ASPECT.Play(this.entity.aspect, this.frameaniSet[index]);
    }
}