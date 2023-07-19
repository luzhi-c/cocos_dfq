
import { OnceplayComponent } from "../Components/OnceplayComponent";
import { EcsMgr } from "../EcsMgr";
import { EntityComponent } from "../Factory";
import { _ASPECT } from "../Service/Aspect";
import { SystemBase } from "../SystemBase";
import { World } from "../World";

export class OnceplaySystem extends SystemBase {

    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("onceplay", true);
        super.Start(world, ecsmgr, map,
            "onceplay"
        );
    }

    private _Handle(e: EntityComponent, tag: string) {
        let main = _ASPECT.GetPart(e.aspect, tag);
        if (e.onceplay.type == "normal" && main.TickEnd()) {
            return true;
        }
        else if (e.onceplay.type == "paused" && !e.aspect.isPause && main.GetTick() == main.GetLength() - 1) {
            return true;
        }
        return false;
    }

    public Update(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e: EntityComponent = this._list.Get(i);
            let onceplay: OnceplayComponent = e.onceplay;
            if (onceplay.timer) {
                onceplay.timer.Update(dt);
                if (!onceplay.timer.isRunning) {
                    // 死亡
                }
            }
            if (onceplay.type) {
                let done = true;
                if (onceplay.objs == "all") {

                }
                else {
                    done = this._Handle(e, "body");
                }

                if (done) {
                    if (e.onceplay.type == "normal") {
                        e.identity.destroyProcess = 1;
                        _ASPECT.ClearCollider(e.aspect);
                    } else if (e.onceplay.type == "paused") {
                        e.aspect.isPause = true;
                    }
                }
            }
        }
    }
}