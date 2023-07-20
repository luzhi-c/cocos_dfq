import { _decorator, Camera, Component, math } from "cc";
import Const from "../../Data/Const";
import { Point } from "./Bstar";
import { _MATH } from "../../Utils/Math";
const { ccclass, property } = _decorator;

@ccclass('GameCamera')
export class GameCamera extends Component {
    private prePosition: Point = new Point();
    private scale: Point = new Point(2, 2);
    private worldPosition: Point = new Point();
    private worldSize: Point = new Point();
    private camera: Camera;
    public SetCamera(camera: Camera) {
        this.camera = camera;
    }

    public SetWorld(x, y, width, height) {
        this.worldPosition.Set(x, y);
        this.worldSize.Set(width, height);
        this.SetScale(1.5);
    }

    public SetScale(scale: number) {
        this.scale.Set(scale, scale);

        this.camera.orthoHeight = Const.designSize.y / 2 * (1 / scale)
    }

    // 保持人物在中心
    public Update(dt, rate) {
        if (Const.user.player) {
            let x = Const.user.player.transform.position.x;
            let y = (Const.user.player.transform.position.y + Const.user.player.transform.position.z);
            this.Adjust(x, y);
        }
    }

    public Adjust(x, y) {
        let left = this.worldPosition.x + (Const.screenSize.x / this.scale.x) / 2;
        let right = this.worldPosition.x + this.worldSize.x - (Const.screenSize.x / this.scale.x) / 2;
        let top = this.worldPosition.y + (Const.screenSize.y / this.scale.y) / 2;
        let down = this.worldPosition.y + this.worldSize.y - (Const.screenSize.y / this.scale.y) / 2;

        let px = x;
        let py = y;
        this.prePosition.Set(_MATH.Clamp(px, left, right), _MATH.Clamp(py, top, down));
        this.camera.node.setPosition(this.prePosition.x, -this.prePosition.y);
    }
}