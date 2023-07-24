import { EcsMgr } from "../EcsMgr";
import { SystemBase } from "../SystemBase";
import { World } from "../World";

export class BattleSystem extends SystemBase
{
    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("battle", true);
        map.set("aspect", true);
        map.set("transform", true);
        map.set("identity", true);
        map.set("attacker", true);
        super.Start(world, ecsmgr, map,
            "battle"
        );
    }

    public Update(dt: number, rate: number): void {
        
    }

}