import { Gear } from "../Base/Gear";
import { _MATH } from "./Math";
import { Ease } from "./Ease";

export class Tween extends Gear {
    private tween: _Tween;
    private duration: number;
    private subject: any;
    private target: any;
    private easing: any;
    private clock: number;
    private initial: number;

    private callback: Function;

    public constructor(subject?, target?, easing?: string, callback?) {
        super();
        if (!easing) {
            easing = "linearFixed";
        }
        this.tween = new _Tween(0, subject, target, easing);
        this.callback = callback;
    }

    private GetEasing(easing: string) {
        return Ease[easing];
    }

    public Update(dt: number) {
        if (!this.isRunning) {
            return;
        }
        if (this.tween.update(dt)) {
            this.Exit();
        }
        this.callback && this.callback();
    }

    public Enter(time, target?, easing?, subject?, callback?): void {
        super.Enter();
        this.tween.duration = time || this.tween.duration
        this.tween.subject = subject || this.tween.subject
        this.tween.target = target || this.tween.target
        this.tween.easing = this.GetEasing(easing) || this.tween.easing
        this.callback = callback;
        this.tween._props = null;
        this.tween.reset()
        this.callback && this.callback();
    }

    public SetEasing(easing) {
        this.tween.easing = this.GetEasing(easing);
    }

    public SetTime(time) {
        this.tween.duration = time;
    }
    public GetSubject() {
        return this.tween.subject;
    }
    public SetTarget(target) {
        this.tween.target = target;
    }
    public GetTarget() {
        return this.tween.target;
    }
    public GetTime() {
        return this.tween.duration;
    }
    public GetProcess() {
        return _MATH.GetFixedDecimal(this.tween.clock / this.tween.duration);
    }
    public Reset() {
        this.isRunning = true;
        this.tween.reset();
    }
}

class _Tween {
    public duration;
    // 当前对象
    public subject;
    // 初始属性
    public _props;
    //目标属性
    public target;
    // 缓动方式
    public easing;
    public clock;

    constructor(duration, subject, target, easing) {
        this.duration = duration;
        this.subject = subject;
        this.target = target;
        if (!easing) {
            easing = Ease.linear;
        }
        this.easing = easing;
        this.clock = 0;
    }

    public set(clock) {
        this.clock = clock;
        if (this._props == null) {
            this._props = {};
            this.setValue(this._props, this.subject, this.target);
        }
        if (clock <= 0) {
            this.clock = 0;
            this.setValue(this.subject, this._props);
        }
        else if (clock >= this.duration) {
            this.clock = this.duration;
            this.setValue(this.subject, this.target);
        }
        else {
            this.setValueByEasing(this.subject, this.target, this._props, this.clock, this.duration, this.easing);
        }
        return this.clock >= this.duration;
    }

    public setValue(subject, copyValue, keyValues?) {
        keyValues = keyValues || copyValue;
        for (let name in keyValues) {
            if (typeof (keyValues[name]) == "number") {
                subject[name] = copyValue[name];
            }
        }
    }

    public setValueByEasing(subject, target, initial, clock, duration, easing) {
        let t;
        let b;
        let c;
        let d;
        for (let k in target) {
            let v = target[k];
            if (typeof (target[k]) == "number") {
                t = clock;
                b = initial[k];
                c = v - initial[k];
                d = duration;
                subject[k] = easing(t, b, c, d)
            }
        }
    }

    public reset() {
        return this.set(0);
    }

    public update(dt) {
        return this.set(this.clock + dt);
    }
}