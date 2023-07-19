import { AspectComponent } from "../ECS/Components/AspectComponent";
import { TransformComponent } from "../ECS/Components/TransformComponent";
import { Gear } from "./Gear";
import { ValueMotion } from "./ValueMotion";

export class EaseMove extends Gear {
    private transform: TransformComponent;
    private aspect: AspectComponent;
    private valueMotion: ValueMotion;
    private type: string;
    private direction: number = 1;
    public constructor(transform: TransformComponent, aspect: AspectComponent) {
        super();
        this.transform = transform;
        this.aspect = aspect;
        this.valueMotion = new ValueMotion();
    }

    public Enter(type, power, speed, direction): void {
        super.Enter();
        this.valueMotion.Enter(power, 0, speed);
        this.type = type;
        this.direction = direction || 1;
    }

    public Update(dt: number): void {
        if (!this.isRunning) {
            return;
        }

        this.valueMotion.Update(dt);
        if (this.valueMotion.isRunning) {
            // 调用移动接口，边界 障碍等判断
        }
        else {
            this.Exit();
        }
    }

    public GetPower() {
        return this.valueMotion.value;
    }

    public GetSpeed() {
        return this.valueMotion.speed;
    }

    public SetSpeed(speed: number) {
        this.valueMotion.speed = speed;
    }
    public SetPower(power: number) {
        this.valueMotion.value = power;
    }
}