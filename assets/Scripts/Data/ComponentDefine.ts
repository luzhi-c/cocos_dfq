import { AIComponent } from "../ECS/Components/AIComponent";
import { AspectComponent } from "../ECS/Components/AspectComponent";
import { BattleComponent } from "../ECS/Components/BattleComponent";
import { EffectComponent } from "../ECS/Components/EffectComponent";
import { IdentityComponent } from "../ECS/Components/IdentityComponent";
import InputComponent from "../ECS/Components/InputComponent";
import { OnceplayComponent } from "../ECS/Components/OnceplayComponent";
import { SkillsComponent } from "../ECS/Components/SkillComponent";
import { StatesComponent } from "../ECS/Components/StatesComponent";
import { TransformComponent } from "../ECS/Components/TransformComponent";

// 组件定义
export namespace Component_Define {
    export const states = StatesComponent;
    export const aspect = AspectComponent;
    export const skills = SkillsComponent;
    export const input = InputComponent;
    export const transform = TransformComponent;
    export const effect = EffectComponent;
    export const identity = IdentityComponent;
    export const onceplay = OnceplayComponent;
    export const battle = BattleComponent;
    export const ais = AIComponent;
}