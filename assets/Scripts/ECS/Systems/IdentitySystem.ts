import { EcsMgr } from "../EcsMgr";
import { SystemBase } from "../SystemBase";
import { World } from "../World";


export default class IdentitySystem extends SystemBase {
    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("identity", true);
        super.Start(world, ecsmgr, map,
            "identity"
        );
    }

    public LateUpdate(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e = this._list.Get(i);
            if (e.identity.destroyProcess > 0) {
                e.identity.destroyProcess = 2
                // e.identity.destroyCaller.Call(e);
                for (let key in e) {
                    this.ecsMgr.DelComponent(e, key);
                }

                e.identity.node.destroy();
            }

        }
    }
}