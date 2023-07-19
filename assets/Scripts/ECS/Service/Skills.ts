import { log } from "cc";
import { AssetType, ResMgr } from "../../Mgr/ResMgr";
import { SkillsComponent } from "../Components/SkillComponent";
import { EntityComponent } from "../Components/EntityComponent";
import { SkillBase } from "../../Game/Skill/SkillBase";

export class _SKILLS {
    public static Set(entity: EntityComponent, key: string, skillPath: string) {
        let skill = entity.skills.container.Get(key);
        if (skill) {

        }
        let data = ResMgr.GetAsset(skillPath, AssetType.skills);
        if (!data) {
            log("未加载到技能配置");
            return;
        }
        let skillCfg = data.json;
        // 增加状态
        if (skillCfg.state && skillCfg.stateData) {
            entity.states.AddState(key, skillCfg.stateData);
        }
        if (skillCfg.script == "base") {
            skill = new SkillBase(entity, key, skillCfg);
        }
        else if (skillCfg.script == "normalAttack") {
            // skill = new SkillBase(entity, key, skillCfg);
        }
        entity.skills.container.Add(skill, key);

        entity.skills.caller.Call(key);
    }
}