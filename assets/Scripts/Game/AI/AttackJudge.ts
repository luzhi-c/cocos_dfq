import { QuickList } from "../../Base/QuickList";
import { EntityComponent } from "../../ECS/Factory";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { _STATE } from "../../ECS/Service/States";
import { GameEntry } from "../../GameEntry";
import { SolidRect } from "../Map/SolidRect";
import { Judge } from "./Judge";

export class AttackJudge extends Judge {
    public static _list1: QuickList<EntityComponent>;
    // public static _list2: QuickList<EntityComponent>;

    public static Init() {
        let map1 = new Map();
        map1.set("battle", true);
        map1.set("states", true);
        this._list1 = GameEntry.EcsMgr.NewComboList(map1);

        // let map2 = new Map();
        // map2.set("attacker", true);
        // this._list2 = GameEntry.EcsMgr.NewComboList(map2);
    }

    public static NewWithConfig(entity: EntityComponent, data: any, key?: string, campType?: string)
    {
        return new AttackJudge(entity, data.collider, key)
    }

    public constructor(entity: EntityComponent, data: string, key?: string, campType?: string) {
        super(entity, data, key);
    }

    public Select() {
        let solidRectList = this.collider.GetList();
        for (let i = 0; i < AttackJudge._list1.GetLength(); i++) {
            let e = AttackJudge._list1.Get(i);
            if (e != this.entity) {
                // 判断阵营 和 碰撞框
                if (_STATE.HasTag(e.states, "attack") && SolidRect.CollideWithList(solidRectList, _ASPECT.GetBodySolidRectList(e.aspect))) {
                    return e;
                }
            }
        }
    }
}