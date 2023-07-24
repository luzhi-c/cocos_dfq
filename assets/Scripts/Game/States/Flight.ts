
import { EntityComponent } from "../../ECS/Factory";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { _STATE } from "../../ECS/Service/States";
import { SoundMgr } from "../../Mgr/SoundMgr";
import { _MATH } from "../../Utils/Math";
import { EaseMove } from "../Gear/EaseMove";
import { StateBase } from "./StateBase";

enum _processEnum { up_1, up_2, up_3, down_1, down_2 };

export class Flight extends StateBase {
    private easeMoveX: EaseMove;
    private easeMoveZ: EaseMove;

    private _power_z: number;
    private _power_x: number;
    private _upSpeed: number;
    private _downSpeed: number;
    private _tmp: number;
    private _process: _processEnum = _processEnum.up_1;
    private _isLow: boolean = false;
    private _isBound: boolean = false;
    private _isBeaten: boolean = false;
    private _inRotate: boolean = false;

    public Init(entity: EntityComponent): void {
        super.Init(entity);

        this.easeMoveX = new EaseMove(this.entity.transform);
        this.easeMoveZ = new EaseMove(this.entity.transform);
    }

    public Enter(lateState, power_z, upSpeed, downSpeed, power_x, speed, direction): void {
        super.Enter();
        let rebound = lateState == this && this.entity.transform.position.z == 0;
        // 将来这里可以减去他的质量 达到大怪击飞减半的效果
        if (rebound) {
            power_z = power_z < 0 ? 0 : power_z;
        }
        let isLow = this.entity.transform.position.z >= -30;
        let isFall = lateState.HasTag("fall");
        power_z = _MATH.GetFixedDecimal(power_z);
        upSpeed = _MATH.GetFixedDecimal(upSpeed);
        downSpeed = _MATH.GetFixedDecimal(downSpeed);
        power_x = _MATH.GetFixedDecimal(power_x);
        speed = _MATH.GetFixedDecimal(speed);

        this._power_z = power_z;
        this._upSpeed = upSpeed;
        this._downSpeed = downSpeed;
        this._power_x = power_x;

        this.easeMoveX.Enter("x", power_x, speed, direction);
        this.easeMoveZ.Enter("z", power_z, upSpeed, -1);
        this._tmp = Math.floor(this._power_z * 0.65);
        this._process = _processEnum.up_1;
        this._isLow = isLow && this._power_z <= 5;
        this._isBound = isFall && this._isLow;
        this._inRotate = false;
    }

    public Update(dt: number, rate: number): void {
        super.Update(dt, rate);
    }

    public NormalUpdate(dt: number, rate: number): void {

        // 自带速度 只需要rate
        this.easeMoveX.Update(rate);
        this.easeMoveZ.Update(rate);
        if (this._process == _processEnum.up_1 && this.easeMoveZ.GetPower() <= this._tmp) {
            this._process = _processEnum.up_2;
            this._tmp = _MATH.GetFixedDecimal(this._power_z * 0.3);
            this.PlayAnimation();
        }
        else if (this._process == _processEnum.up_2 && this.easeMoveZ.GetPower() <= this._tmp) {
            this._process = _processEnum.up_3;
            this.PlayAnimation();
        }
        else if (this._process == _processEnum.up_3 && !this.easeMoveZ.isRunning) {
            this._process = _processEnum.down_1;
            // 下落
            this.easeMoveZ.Enter("z", 0, -this._downSpeed, 1);
            this._tmp = _MATH.GetFixedDecimal(this.entity.transform.position.z * 0.6);
        } else if (this._process == _processEnum.down_1 && this.entity.transform.position.z >= this._tmp) {
            this._process = _processEnum.down_2;
            this.PlayAnimation();
        } else if (this._process == _processEnum.down_2 && this.entity.transform.position.z > 0) {
            this.entity.transform.position.z = 0;
            this.entity.transform.positionTick = true;
            SoundMgr.PlaySound(this.soundSet.voice[0]);
            if (this._isLow) {
                _STATE.Play(this.entity.states, this.nextState);
            }
            else {
                // 高度足够 弹起
                this.Enter(this, this._power_z * 0.5, this._upSpeed, this._downSpeed, this.easeMoveX.GetPower(), this.easeMoveX.GetSpeed(), this.easeMoveX.direction);
            }
        }
    }

    private PlayAnimation() {
        let index = 0;

        if (this._isBound) {
            if (this._process == _processEnum.up_1 || this._process == _processEnum.up_2) {
                if (this._isBeaten) {
                    index = 3;
                }
                else {
                    index = 2;
                }

            } else if (this._process == _processEnum.up_3 || this._process == _processEnum.down_1 || this._process == _processEnum.down_2) {
                if (this._isBeaten) {
                    index = 2;
                }
                else {
                    index = 3;
                }
            }
        }
        else {
            if (this._process == _processEnum.up_1) {
                if (this._isBeaten) {
                    index = 1;
                }
                else {
                    index = 0;
                }
            }
            else if (this._process == _processEnum.up_2) {
                if (this._isBeaten) {
                    index = 0;
                }
                else {
                    index = 1;
                }
            }
            else {
                if (this._isBeaten) {
                    index = 0;
                }
                else {
                    index = 2;
                }
            }

        }
        _ASPECT.Play(this.entity.aspect, this.frameaniSet[index]);
    }
}