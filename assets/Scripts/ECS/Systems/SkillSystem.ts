import { input, Input, KeyCode } from "cc";
import { EcsMgr } from "../EcsMgr";
import { SystemBase } from "../SystemBase";
import { World } from "../World";
import InputComponent from "../Components/InputComponent";
import Const from "../../Data/Const";
import _INPUT, { _LIB_INPUT } from "../Service/Input";
import { SkillsComponent } from "../Components/SkillComponent";
import { SkillBase } from "../../Game/Skill/SkillBase";
import { _SKILLS } from "../Service/Skills";
import { EntityComponent } from "../Factory";

export default class SkillSystem extends SystemBase {
    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("skills", true);
        super.Start(world, ecsmgr, map,
            "skills"
        );
    }

    private _SkillSorting(a: SkillBase, b: SkillBase) {
        return a.order > b.order;
    }

    public OnEnter(entity: EntityComponent): void {
        let skills = entity.skills;
        for (let key in skills.data) {
            _SKILLS.Set(entity, key, skills.data[key]);
        }
        skills.container.Sort(this._SkillSorting);
    }

    public Update(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e: EntityComponent = this._list.Get(i);
            let skills: SkillsComponent = e.skills;
            for (let i = 0; i < skills.container.GetLength(); i++) {
                let skill: SkillBase = skills.container.GetWithIndex(i);
                skill.Update(dt, rate);
            }
        }
    }
}