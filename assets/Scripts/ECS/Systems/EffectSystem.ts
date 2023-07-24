
import { EcsMgr } from "../EcsMgr";
import { EntityComponent } from "../Factory";
import { _ASPECT } from "../Service/Aspect";
import { SystemBase } from "../SystemBase";
import { World } from "../World";

export class EffectSystem extends SystemBase {
    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("effect", true);
        super.Start(world, ecsmgr, map,
            "effect"
        );
    }

    private Adjust(e: EntityComponent) {
        let superior = e.identity.superior;
        let position = superior.transform.position;

        if (e.effect.positionType == "normal") {
            e.transform.position.Set(position.x, position.y, position.z);
        }
        else if (e.effect.positionType == "bottom") {
            e.transform.position.Set(position.x, position.y);
        }
        else if (e.effect.positionType == "top" || e.effect.positionType == "middle") {
            if (e.effect.positionType == "top") {
                e.transform.position.Set(position.x, position.y, position.z - e.effect.height);
            }
            else {
                e.transform.position.Set(position.x, position.y, position.z - Math.floor(e.effect.height * 0.5));
            }
        }
        e.transform.positionTick = true;
    }

    public OnInit(e: EntityComponent): void {
        let superior = e.identity.superior;
        e.effect.height = e.effect.height || _ASPECT.GetPart(superior.aspect).GetHeight();
        if (superior && e.effect.adapt) {
            let part = _ASPECT.GetPart(superior.aspect);
            let part2 = _ASPECT.GetPart(e.aspect);
            let height = part.GetHeight();
            let w = part2.GetHeight();
            e.transform.scale.x = height / w;
            e.transform.scale.y = height / w;
            e.transform.scaleTick = true
        }
        this.Adjust(e);
    }

    public Update(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e: EntityComponent = this._list.Get(i);
            if (e.identity.superior) {
                let superior = e.identity.superior;
                if (e.effect.lockStop) {
                    e.identity.isPaused = superior.identity.isPaused;
                }

                if (e.effect.lockDirection && e.transform.direction != superior.transform.direction) {

                    e.transform.direction = superior.transform.direction
                    e.transform.scaleTick = true
                }
                if (e.effect.lockRate) {
                    e.aspect.rate = superior.aspect.rate;
                }
            }
        }
    }

    public LateUpdate(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e: EntityComponent = this._list.Get(i);
            if (e.identity.superior) {
                let superior = e.identity.superior;
                if (e.effect.lockStop)
                {
                    e.identity.isPaused = superior.identity.isPaused;
                }

                if (e.effect.lockLife && superior.identity.destroyProcess > 0) {
                    e.identity.destroyProcess = 1;
                }

                if (e.effect.positionType && superior.transform.positionTick) {
                    this.Adjust(e);
                }
                if (e.effect.lockState && superior.states && e.effect.state && e.effect.state != superior.states.current) {
                    e.identity.destroyProcess = 1;
                }
            }
        }
    }
}