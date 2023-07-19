import { _decorator, Button, Canvas, Component, ImageAsset, Node, RenderTexture, Sprite, SpriteFrame, Texture2D } from 'cc';
import { GameEntry } from './GameEntry';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property(Button)
    public test1: Button;
    @property(Button)
    public test2: Button;
    protected onLoad(): void {
        this.test1.node.on(Button.EventType.CLICK, this.testfunc1, this);
        this.test2.node.on(Button.EventType.CLICK, this.testfunc2, this);
    }

    private testfunc1()
    {
        GameEntry.GameCamera.SetScale(1);

        let g = GameEntry.gl;
        g.moveTo(700, -500);
        g.lineTo(700, -600);
    }

    private testfunc2()
    {
        GameEntry.GameCamera.SetScale(1.5);
    }
}

