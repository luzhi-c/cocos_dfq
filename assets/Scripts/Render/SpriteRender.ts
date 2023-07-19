import {_decorator, Component, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass('SpriteRender')
export class SpriteRender extends Component
{
    public Init(...param)
    {
        this.addComponent(Sprite);
    }

    public Update(dt: number, rate: number)
    {
    
    }

    public SetData(...param)
    {
    }
}