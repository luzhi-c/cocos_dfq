import { _decorator, Component, log } from "cc";
import { Timer } from "../Base/Timer";
import { AspectPart, FrameaniData } from "../Data/ConfigData";
import { BaseRender } from "./BaseRender";
import { Collider } from "../Game/Collider/Collider";

const { ccclass, property } = _decorator;

@ccclass('FrameAni')
export class FrameAni extends BaseRender {
    private _timer: Timer;
    private _length: number;
    private _forever: boolean;
    private isPaused: boolean;
    protected aspectData: AspectPart;
    public _frameaniData: FrameaniData;

    private _tick: number = 0;
    private _frame: number = 0;
    public Init(aspect, data: AspectPart) {
        super.Init(aspect);
        this.aspectData = data;
        this._timer = new Timer();
        this._length = 0;
        this._forever = false;
        this.isPaused = false;
    }
    public Play(frameaniData: FrameaniData, isOnly = false) {
        if (frameaniData == this._frameaniData) {
            if (isOnly) {
                return false;
            }
            this.Reset();
            this.Adjust();
            return true;
        }
        this._frameaniData = frameaniData;
        if (this._frameaniData) {
            this._length = this._frameaniData.list.length;
        }
        else {
            this._length = 0;
        }
        this.Reset();
        this.Adjust();
        return true;
    }

    public Update(dt: number) {
        this._tick = -1;
        if (!this.isPaused && !this._forever) {
            this._timer.Update(dt);
            if (!this._timer.isRunning) {
                if (this._frame == this._length - 1) {
                    this._frame = 0;
                }
                else {
                    this._frame += 1;
                }
                this._tick = this._frame + 1;
                this.Adjust();
            }
        }

    }


    public Adjust() {
        if (this._frameaniData) {
            this.SetData(this._frame);
            if (this._frameaniData.list[this._frame].time) {
                this._timer.Enter(this._frameaniData.list[this._frame].time);
            }
            else {
                this._timer.Exit();
            }
            this._forever = !this._timer.isRunning;
        }

    }

    public Reset() {
        this._frame = 0;
        this._tick = 0;
    }

    public GetTick() {
        return this._tick;
    }

    public TickEnd() {
        return this._tick == this._length;
    }

    public GetFrame() {
        return this._frame;
    }

    public GetLength() {
        return this._length;
    }

    public GetFrameAniData() {
        return this._frameaniData;
    }

    public SetTime(time: number) {
        this._timer.to = time;
    }


}