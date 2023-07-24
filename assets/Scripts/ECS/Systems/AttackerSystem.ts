import { log } from "cc";
import { EcsMgr } from "../EcsMgr";
import { EntityComponent } from "../Factory";
import { SystemBase } from "../SystemBase";
import { World } from "../World";

export class AttackerSystem extends SystemBase
{
    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("attacker", true);
        map.set("identity", true);
        super.Start(world, ecsmgr, map,
            "attacker"
        );
    }

    public OnEnter(entity: EntityComponent): void {
        log(entity);
    }

    public Update(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e = this._list.Get(i);
            let timer = e.attacker.stopTimer;
            if (timer.isRunning)
            {
                timer.Update(dt * e.identity.rate);
                if (!timer.isRunning)
                {
                    e.identity.isPaused = false;
                    e.attacker.enable = true;
                }
            }
        }
    }

}