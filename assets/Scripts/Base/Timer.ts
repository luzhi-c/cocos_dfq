import { _MATH } from "../Utils/Math";
import { Gear } from "./Gear";

export class Timer extends Gear {
    public from: number = 0;
    public to: number = 0;
    public constructor(time: number = null) {
        super();
        this.from = 0;
        this.to = 0;
        if (time) {
            this.Enter(time);
        }
    }

    public Update(dt: number): void {
        if (!this.isRunning)
        {
            return;
        }
        this.from += dt;
        if (this.to && this.from >= this.to)
        {
            this.from = this.to;
            this.Exit();
        }
    }

    public Enter(time?: number) {
        super.Enter();
        this.from = 0;
        this.to = time || this.to || 0;
        if (this.from == this.to) {
            this.isRunning = false;
        }
    }

    public Exit(): void {
        super.Exit();
    }

    public GetProgress() {
        return _MATH.GetFixedDecimal(this.from / this.to);
    }
}