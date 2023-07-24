import { _decorator, AudioSource, Component, JsonAsset, log, Node, Sprite, warn } from 'cc';
import { AssetType, ResMgr } from '../../Mgr/ResMgr';
import { Caller } from '../../Base/Caller';
import { Matrix } from './Matrix';
import { SpriteData } from '../../Data/ConfigData';
import { _MATH } from '../../Utils/Math';
import { Tools } from '../../Utils/Tools';
import { Factory } from '../../ECS/Factory';
import { GameEntry } from '../../GameEntry';
import { SoundMgr } from '../../Mgr/SoundMgr';
const { ccclass, property } = _decorator;

type MapNode =
    {
        path: string;
        x: number;
        y: number;
    }

@ccclass('GameMap')
export class GameMap extends Component {

    public static _const =
        {
            scope: {
                wv: 0,
                hv: -8,
                uv: -50,
                dv: -40
            },
            wall: {
                left: "effect/weather/wall/left",
                right: "effect/weather/wall/right"
            }
        };

    private mapLoadedCaller: Caller;

    public isPause: boolean = false;
    public matrixGroup =
        {
            normal: new Matrix(16),
            object: new Matrix(64),
            up: new Matrix(100),
            down: new Matrix(100)
        };
    public info =
        {

            name: "",
            theme: "",
            isBoss: false,
            isTown: false,
            width: 0,
            height: 0
        };
    private _layerGroup: Map<string, Node>;

    private _bgs: AudioSource;

    public Init() {
        this.mapLoadedCaller = new Caller();
        this._layerGroup = new Map();
        // 加层
        let far = Factory.NewNode("far");
        far.setParent(this.node);
        this._layerGroup.set("far", far);
        let near = Factory.NewNode("near");
        near.setParent(this.node);
        this._layerGroup.set("near", near);
        let floor = Factory.NewNode("floor");
        floor.setParent(this.node);
        this._layerGroup.set("floor", floor);
        let object = Factory.NewNode("object");
        object.setParent(this.node);
        this._layerGroup.set("object", object);
        let effect = Factory.NewNode("effect");
        effect.setParent(this.node);
        this._layerGroup.set("effect", effect);
    }

    public LoadMap(source: string) {
        let mapData = ResMgr.GetAsset(source, AssetType.map);
        this.Make(mapData.json);
    }
    public Make(config: any) {
        let data: any = {};
        data.info = config.info;

        data.scope = {
            x: config.scope.x,
            y: config.scope.y,
            wv: config.scope.wv || GameMap._const.scope.wv,
            hv: config.scope.hv || GameMap._const.scope.hv,
            uv: config.scope.uv || GameMap._const.scope.uv,
            dv: config.scope.dv || GameMap._const.scope.dv
        }

        data.scope.w = data.info.width - data.scope.x + data.scope.wv;
        data.scope.h = data.info.height - data.scope.y + data.scope.hv;

        data.actor = [];
        data.layer = {
            far: <Array<MapNode>>[],
            near: <Array<MapNode>>[],
            floor: <Array<MapNode>>[],
            object: <Array<MapNode>>[],
            effect: <Array<MapNode>>[],
        };

        this.info = config.info;
        let matrix = this.matrixGroup.normal;
        let objectMatrix = this.matrixGroup.object;
        let upMatrix = this.matrixGroup.up;
        let downMatrix = this.matrixGroup.down;
        matrix.Reset(data.scope.x, data.scope.y, data.scope.w, data.scope.h, true);
        objectMatrix.Reset(data.scope.x, data.scope.y, data.scope.width, data.scope.height, true);
        upMatrix.Reset(data.scope.x, data.info.horizon + data.scope.uv, data.scope.width, upMatrix.GetGridSize(), true);
        downMatrix.Reset(data.scope.x, data.scope.y + data.scope.h + data.scope.dv, data.scope.width, downMatrix.GetGridSize(), true);

        GameEntry.GameCamera.SetWorld(0, 0, data.info.width, data.info.height)
        // 生成传送门
        data.actor.push({
            path: GameMap._const.wall.left,
            x: 0,
            y: data.info.height
        });
        data.actor.push({
            path: GameMap._const.wall.right,
            x: data.info.width,
            y: data.info.height
        });
        // 生成背景
        this.MakeBackGround(data.layer.far, config.far, data.info.width);
        this.MakeBackGround(data.layer.near, config.near, data.info.width);
        //  生成地板
        if (config.floor) {
            let x = 0;
            while (x < data.info.width) {
                let top = this.GetRandomFloor(config.floor.top);
                let extra = this.GetRandomFloor(config.floor.extra);
                let tail = this.GetRandomFloor(config.floor.tail);
                let y = config.floor.y || config.floor.horizon;
                let height = config.floor.height || top.spriteData.height;
                data.layer.floor.push({ sprite: top.path, x: x, y });
                y = y + height;
                while (y < data.info.height) {
                    data.layer.floor.push({ sprite: extra.path, x: x, y: y });
                    y = y + extra.spriteData.height;
                }
                if (tail) {
                    data.layer.floor.push({ sprite: tail.path, x: x, y: data.info.height - tail.spriteData.height });
                }

                x = x + top.spriteData.width;
            }
        }
        // 生成地板上的装饰物
        if (config.object) {
            if (config.object.floor) {
                let a = 5;
                let b = 15;
                // objectMatrix.Assign((x, y) => {
                //     let path = config.object.floor[_MATH.RangeInt(0, config.object.floor.length)];
                //     data.layer.floor.push({ sprite: path, x: x, y: y });
                // }, _MATH.RangeInt(a, b), true);
            }
        }
        // 渲染地图
        this.OnLoaded(data);
        // 回调地图加载完成
        this.mapLoadedCaller.Call();
        if (data.info.bgm)
        {
            SoundMgr.PlayMusic(data.info.bgm);
        }

        if (data.info.bgs)
        {
          this._bgs = SoundMgr.PlaySoundByCtrol(data.info.bgs, true);
        }
    }

    public OnLoaded(data) {
        for (let key in data.layer) {
            if (key == "effect") {

            }
            else {
                let layer = this._layerGroup.get(key);
                if (!layer) {
                    continue;
                }
                for (let i = 0; i < data.layer[key].length; i++) {
                    let sprite = Factory.NewNode("sprite").addComponent(Sprite);
                    sprite.node.setParent(layer);
                    let spriteData: SpriteData = data.layer[key][i].spriteData;
                    if (!spriteData) {
                        spriteData = ResMgr.GetAsset(data.layer[key][i].sprite, AssetType.sprite);
                    }
                    sprite.spriteFrame = spriteData.sprite;
                    // 转换坐标
                    let truePos = Tools.GetTruePosition(spriteData, data.layer[key][i].x, data.layer[key][i].y);
                    sprite.node.setPosition(truePos.x, truePos.y);
                }
            }
        }
    }

    private GetRandomFloor(part) {
        if (!part) {
            return;
        }
        let path = part;
        if (part instanceof (Array)) {
            path = part[_MATH.RangeInt(0, part.length)]
        }
        let spriteData = ResMgr.GetAsset(path, AssetType.sprite);
        return { path, spriteData }
    }

    private MakeBackGround(layer: Array<any>, path: string, width) {
        if (!path) {
            return;
        }
        let spriteData = ResMgr.GetAsset(path, AssetType.sprite);
        if (!spriteData) {
            warn("未加载到")
            return;
        }
        let count = Math.ceil(width / spriteData.width);
        for (let i = 0; i < count; i++) {
            // 补齐自己的宽高的一半
            layer.push({ sprite: path, x: spriteData.width * i, y: 0 })
        }
    }

    public GetMatrix(key?: string): Matrix {
        key = key || "normal"
        return this.matrixGroup[key]
    }

    public GetLayer(key?: string) {
        key = key || "object"
        return this._layerGroup.get(key);
    }
}