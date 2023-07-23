import { JsonAsset, Node, Sprite } from "cc";
import { AspectPart, CollsiderData, FrameaniData, SpriteData } from "../Data/ConfigData";
import { FrameAni } from "./FrameAni";
import { AssetType, ResMgr } from "../Mgr/ResMgr";
import { Tools } from "../Utils/Tools";
import { Factory } from "../ECS/Factory";
import { Collider } from "../Game/Collider/Collider";

// 带碰撞框的帧动画
export class FrameAniEx extends FrameAni {

    public static _collidersPoor: Map<FrameaniData, Map<number, Collider>> = new Map();

    protected isPart: boolean = false; // 是否由多个部位动画组成
    protected parts: any;
    protected partsList: Array<string> = [];
    protected aspectData: AspectPart;
    public frameaniParts: Map<string, Sprite> = new Map();
    public Init(aspect, data: AspectPart): void {
        super.Init(aspect, data);
        if (this.aspect.avatar && data.parts != null) {
            this.isPart = true;
            this.SetParts(data.parts);
            this.HandleData();
        }
        else {
            let frameaniData = ResMgr.GetAsset(data.frameaniPath, AssetType.frameani).json;
            this.isPart = false;
            this.SetNode();
            this.Play(frameaniData);
        }
    }

    public HandleData() {
        let aspectData = (ResMgr.GetAsset(this.aspectData.avatar, AssetType.aspect) as JsonAsset).json;
        this.SortLayer(aspectData);
    }

    public SortLayer(aspectData) {
        this.partsList = [];
        this.frameaniParts.forEach((value, key) => {
            this.partsList.push(key);
        });
        this.partsList.sort((a, b) => {
            return aspectData.layer[a] - aspectData.layer[b];
        })

        for (let i = 0; i < this.partsList.length; i++) {
            let part = this.frameaniParts.get(this.partsList[i]);
            part.node.setSiblingIndex(i);
        }
    }

    public SetNode() {
        let node = Factory.NewNode("body");
        let sp = node.addComponent(Sprite);
        this.frameaniParts.set("body", sp);
        node.setParent(this.node);
    }

    public SetParts(partList) {
        this.parts = partList;
        for (let part in partList) {
            let node = Factory.NewNode(part);
            let sp = node.addComponent(Sprite);
            this.frameaniParts.set(part, sp);
            node.setParent(this.node);
        }
    }

    public GetFramePartPath(key: string, sprite: string) {
        let url = "";
        if (this.isPart) {
            url = `${this.aspectData.spritePath}/${this.GetPartPath(key)}/${sprite}`;
        }
        else {
            url = `${this.aspectData.spritePath}/${sprite}`;
        }
        return ResMgr.GetFrameaniSpriteBasePath(url);
    }

    public GetPartPath(key) {
        if (this.aspectData.parts) {
            return this.parts[key];
        }
        return "";
    }

    public SetData(index) {
        if (this.isPart) {
            this.frameaniParts.forEach((value, key) => {
                let sprite = this.frameaniParts.get(key);
                ResMgr.LoadSpriteData(this.GetFramePartPath(key, this._frameaniData.list[index].sprite), (spriteData: SpriteData) => {
                    if (!this.isValid) {
                        return;
                    }
                    sprite.spriteFrame = spriteData.sprite;
                    let offset = Tools.GetImagePosition(spriteData.ox, spriteData.oy, spriteData.width, spriteData.height);
                    sprite.node.setPosition(offset.x, offset.y);
                });
            }
            );
        }
        else {

            let sprite = this.frameaniParts.get("body");
            ResMgr.LoadSpriteData(this.GetFramePartPath("", this._frameaniData.list[index].sprite), (spriteData: SpriteData) => {
                if (!this.isValid) {
                    return;
                }
                sprite.spriteFrame = spriteData.sprite;
                let offset = Tools.GetImagePosition(spriteData.ox, spriteData.oy, spriteData.width, spriteData.height);
                sprite.node.setPosition(offset.x, offset.y);
            });
        }

        // 更新碰撞框
        if (this._colliders) {
            this.SetCollider(this._colliders.get(index));
        }
    }

    private _NewColliders(frameaniData) {
        let map = new Map();
        for (let i = 0; i < frameaniData.list.length; i++) {
            let jsons = [];
            for (let j = 0; j < frameaniData.colliderPath.length; j++) {
                let colliderData = ResMgr.GetAsset(frameaniData.colliderPath[j] + "/" + frameaniData.list[i].sprite, AssetType.collider);
                if (colliderData) {
                    jsons.push(colliderData.json);
                }
            }
            if (jsons.length > 0) {
                let temp: any = {};
                Object.assign(temp, jsons[0]);
                for (let i = 1; i < jsons.length; i++) {
                    for (let key in jsons[i]) {
                        if (temp[key]) {
                            temp[key] = temp[key].concat(jsons[i][key]);
                        }
                        else {
                            temp[key] = jsons[i][key];
                        }
                    }
                }
                let collider = new Collider(temp);
                map.set(i, collider);
            }
        }
        return map;
    }

    public Play(frameaniData: FrameaniData, isOnly?: boolean): boolean {

        if (frameaniData.colliderPath) {
            if (!FrameAniEx._collidersPoor.has(frameaniData)) {
                FrameAniEx._collidersPoor.set(frameaniData, this._NewColliders(frameaniData));
            }
            this._colliders = FrameAniEx._collidersPoor.get(frameaniData);
        }
        return super.Play(frameaniData, isOnly);
    }


}