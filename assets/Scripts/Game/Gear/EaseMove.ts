import { Gear } from "../../Base/Gear";
import { ValueMotion } from "../../Base/ValueMotion";
import { TransformComponent } from "../../ECS/Components/TransformComponent";
import { Motion } from "../../ECS/Service/Motion";

export class EaseMove extends Gear {
    private transform: TransformComponent;
    private _valueMotion: ValueMotion;
    private type: string;
    public direction: number;
    public constructor(transform: TransformComponent) {
        super();
        this.transform = transform;
        this._valueMotion = new ValueMotion();
    }

    public  Enter(type: string, power: number, speed: number, direction?: number): void {
        super.Enter();
        this._valueMotion.Enter(power, 0, speed);
        this.type = type;
        this.direction = direction || 1;
    }

    public Update(dt: number): void {
        if (!this.isRunning) {
            return;
        }
        this._valueMotion.Update(dt);

        if (this._valueMotion.isRunning) {
            Motion.Move(this.transform, this.type, this._valueMotion.value * this.direction * dt);
        }
        else {
            this.Exit();
        }
    }
    public SetPower(value) {
        this._valueMotion.value = value;
    }


    public GetPower() {
        return this._valueMotion.value;
    }

    public GetSpeed() {
        return this._valueMotion.speed;
    }
}