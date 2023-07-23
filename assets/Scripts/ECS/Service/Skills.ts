import { log } from "cc";
import { AssetType, ResMgr } from "../../Mgr/ResMgr";
import { SkillsComponent } from "../Components/SkillComponent";
import { SkillBase } from "../../Game/Skill/SkillBase";
import { EntityComponent } from "../Factory";
import { Skill_Define } from "../../Data/SkillDefine";

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
            entity.states.AddState(skillCfg.state, skillCfg.stateData);
        }
        let cls = Skill_Define[skillCfg.script];
        if (cls)
        {
            skill = new cls(entity, key, skillCfg);
        }
        entity.skills.container.Add(skill, key);

        entity.skills.caller.Call(key);
    }
}