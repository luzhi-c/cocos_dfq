import { QuickList } from "../../Base/QuickList";
import { CollsiderData } from "../../Data/ConfigData";
import { EntityComponent } from "../../ECS/Factory";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { GameEntry } from "../../GameEntry";
import { AssetType, ResMgr } from "../../Mgr/ResMgr";
import { SolidRect } from "../Map/SolidRect";
import { Judge } from "./Judge";

export class BattleJudge extends Judge {
    public static _list: QuickList<EntityComponent>;
    public static Init() {
        let map = new Map();
        map.set("battle", true);
        map.set("aspect", true);
        this._list = GameEntry.EcsMgr.NewComboList(map);
    }

    public static NewWithConfig(entity:EntityComponent, data: any, key?: string, campType?: string)
    {
        return new BattleJudge(entity, data.collider, key, campType);
    }

    public constructor(entity:EntityComponent, data: string, key?: string, campType?: string)
    {
        super(entity, data, key);
    }

    public Select()
    {
        let solidRectList = this.collider.GetList("attack");
        for (let i = 0; i < BattleJudge._list.GetLength(); i++) {
            let e = BattleJudge._list.Get(i);
            if (e != this.entity)
            {
                // 判断阵营 和 碰撞框
                let result = SolidRect.CollideWithList(solidRectList, _ASPECT.GetBodySolidRectList(e.aspect));
                if (result.isDone)
                {
                    return e;
                }
            }
        }
    }
}