import { Vec2, Vec3 } from "cc";
import { ComponentBase } from "../ComponentBase";
import { Point, Point3 } from "../../Game/Map/Bstar";

export class TransformComponent extends ComponentBase {
    public position: Point3;
    public shake : Point;
    public shift : Point;
    public scale : Point;
    public positionTick = true;
    public scaleTick = true;
    public radianTick = true;
    public direction = 1;
    public Init(data, param) {
        this.position = new Point3(param.x, param.y, param.z);
        this.shake = new Point(0, 0);
        this.shift = new Point(0, 0);
        this.scale = new Point(1, 1);
        this.direction = param.direction || 1;
        this.positionTick = true;
        this.scaleTick = true;
        this.radianTick = true;
    }
}