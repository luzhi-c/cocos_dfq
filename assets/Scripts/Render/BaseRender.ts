import { _decorator, Component, Sprite, SpriteFrame, tween, Tween } from "cc";
import { AspectComponent } from "../ECS/Components/AspectComponent";
import { Collider } from "../Game/Collider/Collider";
const { ccclass, property } = _decorator;

@ccclass('BaseRender')
export class BaseRender extends Component {
    public aspect: AspectComponent;
    public height: number;
    public _colliders: Map<number, Collider>; // 每帧的碰撞框
    public _collider: Collider;
    public Init(aspect, ...param) {
        this._colliders = new Map();
        this.aspect = aspect;
        this.height = aspect.height;
    }

    public Play(...param) {

    }

    public Update(dt: number, rate: number) {

    }

    public Draw()
    {
        if (this._collider)
        {
            this._collider.Draw();
        }
    }

    public SetData(...param) {
    }

    public GetCollider() {
        return this._collider;
    }

    public SetCollider(collider: Collider) {
        this._collider = collider;
        this.AdjustCollider();
    }

    public AdjustCollider() {
        if (!this._collider) {
            return;
        }
        if (!this.aspect || !this.aspect.entity) {
            return;
        }
        let transform = this.aspect.entity.transform;
        this._collider.Set(transform.position.x, transform.position.y, transform.position.z, transform.scale.x * transform.direction, transform.scale.y);
    }

    public GetTick()
    {
        return 0;
    }

    public TickEnd() {
        return true;
    }

    public GetLength() {
        return 0;
    }

    public GetHeight()
    {
        return this.height;
    }
}