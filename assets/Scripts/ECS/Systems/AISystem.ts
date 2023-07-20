import { Timer } from "../../Base/Timer";
import { AI_Define } from "../../Data/AIDefine";
import { EcsMgr } from "../EcsMgr";
import { EntityComponent } from "../Factory";
import { SystemBase } from "../SystemBase";
import { World } from "../World";


export default class AISystem extends SystemBase {
    private timer: Timer;

    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("ais", true);
        map.set("input", true);
        super.Start(world, ecsmgr, map,
            "ais"
        );
        this.timer = new Timer();
    }

    public OnEnter(entity: EntityComponent): void {
        let ais = entity.ais;
        for (let key in ais.data) {
            let cls = AI_Define[key];
            if (cls) {
                let ai = cls.NewWithConfig(entity, ais.data[key]);
                ais.container.Add(ai, key);
            }
        }
    }

    public Update(dt: number, rate: number): void {
        this.timer.Update(dt);
        if (this.timer.isRunning) {
            return;
        }
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e = this._list.Get(i);
            let ais = e.ais;
            let exit = false;
            if (ais.enable) {
                for (let j = 0; j < ais.container.GetLength(); j++) {
                    let ai = ais.container.GetWithIndex(j);
                    if (ai.login) {
                        if (ai.Update(dt)) {
                            exit = true;
                            break;
                        }
                    }
                }
            }
            // 同一帧 只操作一个AI
            if (exit) {
                this.timer.Enter();
                break;
            }
        }
    }

    public LateUpdate(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e = this._list.Get(i);
            let ais = e.ais;
            if (ais.enable) {
                for (let j = 0; j < ais.container.GetLength(); j++) {
                    let ai = ais.container.GetWithIndex(j);
                    if (ai.login) {
                        ai.LateUpdate(dt);
                    }
                }
            }
        }
    }
}