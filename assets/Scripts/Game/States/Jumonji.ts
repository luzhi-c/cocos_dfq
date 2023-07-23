import { EffectComponent } from "../../ECS/Components/EffectComponent";
import { EntityComponent, Factory } from "../../ECS/Factory";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { _STATE } from "../../ECS/Service/States";
import { SoundMgr } from "../../Mgr/SoundMgr";
import { FrameAni } from "../../Render/FrameAni";
import { BattleJudge } from "../AI/BattleJudge";
import { Attack } from "../Gear/Attack";
import { SkillBase } from "../Skill/SkillBase";
import { StateBase } from "./StateBase";

// 十字斩
export class Jumoji extends StateBase {
    private _skill: SkillBase;
    private _effect: EntityComponent;
    private _ticks: number[];
    private _attack: Attack;
    public Init(entity: EntityComponent) {
        super.Init(entity);

        this._attack = new Attack(this.entity);
    }

    public Enter(lateState, skill: SkillBase): void {
        super.Enter();
        this._skill = skill;
        this._attack.Exit();
        SoundMgr.PlaySound(this.soundSet.voice[0]);
    }

    public HandleData(data): void {
        super.HandleData(data);
        this._ticks = data.ticks;
    }


    public NormalUpdate(dt: number, rate: number): void {
        let main: FrameAni = _ASPECT.GetPart(this.entity.aspect) as FrameAni;
        let tick = main.GetTick();

        this._attack.Update(dt);
        if (tick == this._ticks[0]) {
            this._effect = Factory.New(this.actorSet[0], { entity: this.entity }, "effect");
            this._attack.Enter(this.attackDataSet[0], this._skill._attackValues[0], null, null, true);
            this._attack.collision.set(_ASPECT.GetPart(this._effect.aspect), "attack");
            SoundMgr.PlaySound(this.soundSet.swing[0]);
        }
        else if (tick == this._ticks[1]) {
            this._effect.effect.lockDirection = false;
            this._effect.effect.positionType = null;
            this._attack.Enter(this.attackDataSet[1], this._skill._attackValues[1], null, null, true);
            this._attack.collision.set(_ASPECT.GetPart(this._effect.aspect), "attack");
            SoundMgr.PlaySound(this.soundSet.swing[0]);
        }
        else if (tick == this._ticks[2]) {
            this._effect.effect.state = null;
            this._effect.effect.lockStop = false;
            this._effect.identity.destroyCaller.AddListener(this, this.NewBullet.bind(this));
            this._effect = null;
        }
        _STATE.AutoPlayEnd(this.entity.states, this.entity.aspect, this.nextState);
    }

    private NewBullet(effect: EntityComponent) {
        Factory.New(this.actorSet[1], { entity: this.entity }, "effect");
    }
}