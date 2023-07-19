import { Point } from "../Game/Map/Bstar";
import InputComponent from "./Components/InputComponent";
import { TransformComponent } from "./Components/TransformComponent";
import _INPUT from "./Service/Input";
import { Motion } from "./Service/Motion";

export class ControlMove {
    private transform: TransformComponent;
    private input: InputComponent;
    private speed: Point;
    private turnDirection: boolean;
    private OnReleased: Function;
    private _axis: Point = new Point();

    public constructor(transform: TransformComponent, input: InputComponent, speed: Point, turnDirection: boolean, OnReleased: Function) {
        this.transform = transform;
        this.input = input;
        this.speed = speed;
        this.turnDirection = turnDirection;
        this.OnReleased = OnReleased;
    }

    public Update() {
        let up = _INPUT.IsHold(this.input, "up");
        let down = _INPUT.IsHold(this.input, "down");
        let right = _INPUT.IsHold(this.input, "right");
        let left = _INPUT.IsHold(this.input, "left");
        let axisX = 0;
        let axisY = 0;
        if (up || down) {
            if (up && down) {
                axisY = 0;
            }
            else if (up) {
                axisY = -1;
            }
            else if (down) {
                axisY = 1;
            }
        }
        else {
            axisY = 0;
        }

        if (left || right) {
            if (left && right) {
                axisX = 0;
            }
            else if (left) {
                axisX = -1;
            }
            else if (right) {
                axisX = 1;
            }
        }
        else {
            axisX = 0;
        }

        if (this.turnDirection && !_INPUT.IsHold(this.input, "lockOn") && axisX != 0 && this.transform.direction != axisX) {
            this.transform.direction = axisX;
            this.transform.scaleTick = true;
        }

        if (axisX != 0)
        {
            Motion.Move(this.transform, "x", this.speed.x * axisX);
        }
        if (axisY != 0)
        {
            Motion.Move(this.transform, "y", this.speed.y * axisY);
        }
        if (this.OnReleased && (this._axis.x != 0 || this._axis.y != 0) && !up && !down && !left && !right)
        {
            this.OnReleased();
        }
        this._axis.Set(axisX, axisY);
    }

    public SetMoveSpeed(x, y)
    {
        this.speed.Set(x, y);
    }
}