import { JsonAsset, log, resources, Node, Sprite, SpriteFrame, error } from "cc";
import { World } from "./World";
import { EcsMgr } from "./EcsMgr";
import { GameEntry } from "../GameEntry";
import { TransformComponent } from "./Components/TransformComponent";
import { AspectComponent } from "./Components/AspectComponent";
import { AssetType, ResMgr } from "../Mgr/ResMgr";
import { StatesComponent } from "./Components/StatesComponent";
import InputComponent from "./Components/InputComponent";
import { SkillsComponent } from "./Components/SkillComponent";
import { Component_Define } from "../Data/ComponentDefine";
import { ComponentBase } from "./ComponentBase";
import { IdentityComponent } from "./Components/IdentityComponent";
import { EffectComponent } from "./Components/EffectComponent";
import { OnceplayComponent } from "./Components/OnceplayComponent";

export type EntityComponent =
    {
        states?: StatesComponent;
        input?: InputComponent;
        aspect?: AspectComponent;
        skills?: SkillsComponent;
        identity?: IdentityComponent;
        effect?: EffectComponent;
        onceplay?: OnceplayComponent;
        transform?: TransformComponent;
    }

export class Factory {

    public static Clear() {
        this._Count = 0;
    }

    public static NewNode(name?: string) {
        let node = new Node(name);
        node.layer = 1;
        return node;
    }
    // entity唯一id
    public static _Count = 0;

    public static New(path, params, type?: string) {
        type = type || "duelist";
        let data = ResMgr.GetAsset(path, AssetType.instance);
        if (!data) {
            return;
        }
        this._Count++;
        // 配置数据
        let p: any = data.json;
        // 增加节点
        let node = this.NewNode(path);
        let entity: EntityComponent = {};
        node.setParent(GameEntry.GameMap.GetLayer());

        let identity = node.addComponent(IdentityComponent);
        identity.Init(p.identity, params, this._Count);
        GameEntry.EcsMgr.AddComponent(entity, "identity", identity);

        for (let key in p) {
            if (key != "identity") {
                let cls = Component_Define[key];
                if (cls) {
                    let component: ComponentBase = node.addComponent(cls);
                    component.Init(p[key], params);
                    GameEntry.EcsMgr.AddComponent(entity, key, component);
                }
            }
        }
        if (type == "duelist") {
            // 增加输入系统
            let cls = Component_Define["input"];
            if (cls) {
                let component: ComponentBase = node.addComponent(cls);
                component.Init();
                GameEntry.EcsMgr.AddComponent(entity, "input", component);
            }

        } else if (type == "effect") {
            // 增加特效
            let cls = Component_Define["onceplay"];
            if (cls && !entity.effect && data.onceplay != false) {
                let component: ComponentBase = node.addComponent(cls);
                component.Init();
                GameEntry.EcsMgr.AddComponent(entity, "onceplay", component);
            }

        }

        if (!entity.transform) {
            let cls = Component_Define["transform"];
            if (cls) {
                let component: ComponentBase = node.addComponent(cls);
                component.Init(null, params);
                GameEntry.EcsMgr.AddComponent(entity, "transform", component);
            }
        }
        return entity;
    }
}