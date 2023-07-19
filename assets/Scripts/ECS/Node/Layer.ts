import { _decorator, Component, Sprite, Node, SpriteFrame, log } from "cc";
import { FrameAniEx } from "../../Render/FrameAniEX";
import { BaseRender } from "../../Render/BaseRender";
import { QuickList } from "../../Base/QuickList";
import { AspectPart } from "../../Data/ConfigData";
import { Factory } from "../Factory";
import { AspectComponent } from "../Components/AspectComponent";
import Const from "../../Data/Const";
const { ccclass, property } = _decorator;

@ccclass('Layer')
export class Layer extends Component {
    public aspect: AspectComponent;
   
    protected map: Map<string, BaseRender> = new Map();
    public Init(aspect: AspectComponent) {
        this.map = new Map();
        this.aspect = aspect;
    }

    public Get(name: string) {
        return this.map.get(name);
    }

    public GetMap()
    {
        return this.map;
    }

    public Add(data: AspectPart) {
        let name = data.name || "body";
        let node = Factory.NewNode(name);
        node.setParent(this.node);
        let baseRender: BaseRender;
        if (data.type == "sprite") {
            baseRender = node.addComponent(BaseRender);
        }
        else if (data.type == "frameani") {
            baseRender = node.addComponent(FrameAniEx);
        }
        baseRender.Init(this.aspect, data);
        node.setSiblingIndex(0);
        this.map.set(name, baseRender);
    }

    public Update(dt: number, rate: number = 1) {
        for (let render of this.map.values()) {
            render.Update(dt, rate);
            if (Const.debug.collider)
            {
                render.Draw();
            }
        }
    }
}