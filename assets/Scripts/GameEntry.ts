import { _decorator, Camera, Canvas, Component, Game, Graphics, JsonAsset, log, Node, resources, Vec2, Vec3, view } from 'cc';
import { QuickList } from './Base/QuickList';
import { World } from './ECS/World';
import { EcsMgr } from './ECS/EcsMgr';
import { Factory } from './ECS/Factory';
import { Tools } from './Utils/Tools';
import { ResMgr } from './Mgr/ResMgr';
import { _ASPECT } from './ECS/Service/Aspect';
import { GameTime } from './Game/GameTime';
import { Caller } from './Base/Caller';
import { Matrix } from './Game/Map/Matrix';
import Const from './Data/Const';
import { _MATH } from './Utils/Math';
import { GameMap } from './Game/Map/GameMap';
import _INPUT from './ECS/Service/Input';
import { GameCamera } from './Game/Map/GameCamera';
import { SoundMgr } from './Mgr/SoundMgr';
import { Tween } from './Utils/Tween';
const { ccclass, property } = _decorator;

@ccclass('GameEntry')
export class GameEntry extends Component {
    public isPreload = false;
    public static World: World;
    public static EcsMgr: EcsMgr;
    public static actorLayer: Node;
    @property(Node)
    public gameLayer: Node;
    @property(Camera)
    public gameCamera: Camera;
    @property(Graphics)
    public graphics: Graphics;
    public static GameMap: GameMap;
    public static GameCamera: GameCamera;
    public static gl: Graphics;
    start() {
        for (let i = 0; i < 5; i++) {
            log(_MATH.RangeInt(0, 10));
        }
        Const.Init();

        let canvasSize = view.getVisibleSize();
        Const.SetScreenSize(canvasSize.x, canvasSize.y);

        GameEntry.World = this.addComponent(World);
        GameEntry.EcsMgr = this.addComponent(EcsMgr);
        GameEntry.GameCamera = this.gameCamera.addComponent(GameCamera);
        GameEntry.GameCamera.SetCamera(this.gameCamera);
        GameEntry.gl = this.graphics;
        // 启动
        GameEntry.actorLayer = this.gameLayer;
        let mapsource = "lorien";
        ResMgr.PreLoadMap(mapsource, () => {
            // 创建地图
            let node = Factory.NewNode("GameMap");
            node.setParent(this.gameLayer);
            GameEntry.GameMap = node.addComponent(GameMap);
            GameEntry.GameMap.Init();
            GameEntry.GameMap.LoadMap(mapsource);

            ResMgr.PreLoad("duelist/swordman", () => {
                GameEntry.World.Start();
                let entity = Factory.New("duelist/swordman", {
                    x: 700,
                    y: 500,
                    z: 0,
                });

                Factory.New("duelist/swordman", {
                    x: 800,
                    y: 400,
                    z: 0,
                });
                Const.user.SetPlayer(entity);
            });
        });
    }
    public Update() {
        let dt = GameTime.GetDelta();
        GameTime.FrameUpdate();
        GameEntry.World.Update(dt, 1);
        GameEntry.GameCamera.Update(dt, 1);

        // 回收声音
        SoundMgr.Update();
    }

    update(deltaTime: number) {
        GameTime.Update(deltaTime);
        if (GameTime.CanUpdate()) {
            this.Update();
            GameTime.LateUpdate();
        }

    }
}

