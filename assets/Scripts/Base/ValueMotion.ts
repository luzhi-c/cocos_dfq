import { _MATH } from "../Utils/Math";
import { Gear } from "./Gear";

export class ValueMotion extends Gear {
    private from: number = 0;
    private to: number = 0;
    public value: number = 0;
    public speed: number = 0;
    private direction: number = 1;
    private isRound: boolean = false;
    public constructor() {
        super();

    }

    public Enter(from: number, to: number, speed: number, isRound: boolean = false): void {
        super.Enter();
        this.from = from;
        this.to = to;
        this.value = this.from;
        this.speed = speed;
        this.isRound = isRound;
        this.direction = this.from < this.to ? 1 : -1;
    }

    public Update(rate: number): void {
        if (!this.isRunning) {
            return;
        }
        this.value += _MATH.GetFixedDecimal(this.speed * this.direction * rate);

        if (this.speed > 0 && ((this.direction == 1 && this.value >= this.to) || (this.direction == -1 && this.value <= this.to))) {
            this.value = this.to;
            if (this.isRound) {
                this.Enter(this.to, this.from, this.speed, this.isRound);
            }
            else {
                this.Exit();
            }
        }
    }
}