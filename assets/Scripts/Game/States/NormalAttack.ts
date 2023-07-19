import { EntityComponent } from "../../ECS/Components/EntityComponent";
import { StateBase } from "./StateBase";
import { _STATE } from "../../ECS/Service/States";
import _INPUT from "../../ECS/Service/Input";
import Const from "../../Data/Const";
import { SkillBase } from "../Skill/SkillBase";
import { log } from "cc";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { FrameAni } from "../../Render/FrameAni";
import { SoundMgr } from "../../Mgr/SoundMgr";
import { Motion } from "../../ECS/Service/Motion";
import { Attack } from "../Gear/Attack";

export class NormalAttack extends StateBase {
    private _progress = 0;
    private _hasPressed: boolean = false;
    private _skill: SkillBase;
    private _frames: number[];
    private _ticks : number[];
    private _attack: Attack;

    public Init(entity: EntityComponent) {
        super.Init(entity);

        this._attack = new Attack(this.entity);
    }
    public Enter(lateState, skill: SkillBase): void {
        if (lateState != this) {
            super.Enter();
            this._skill = skill;
           
            this.SetProgress(0);
        }
        else {
            this._hasPressed = true;
        }
    }

    public HandleData(data): void {
        super.HandleData(data);
        this._frames = data.frames;
        this._ticks = data.ticks;
    }

    public NormalUpdate(dt: number, rate: number): void {
        let main: FrameAni = _ASPECT.GetPart(this.entity.aspect) as FrameAni;
        let frame = main.GetFrame();

        if (this.HasTick())
        {
            this.EnterAttack();
        }
        this._attack.Update(dt); 

        let isEnd = this._progress >= this.frameaniSet.length;
        let keyFrame = !isEnd ? this._frames[this._progress] : 0;
        if (!isEnd && this._hasPressed && frame > keyFrame) {
            this.SetProgress(this._progress + 1);
        }
        else if (main.TickEnd()) {
            _STATE.Play(this.entity.states, this.nextState);
        }
    }

    public SetProgress(progress: number) {
        this._progress = progress;
        this._hasPressed = false;
        this._skill.Reset();

        Motion.TurnDirection(this.entity.transform, this.entity.input);

        SoundMgr.PlaySound(this.soundSet.voice[this._progress]);
        _ASPECT.Play(this.entity.aspect, this.frameaniSet[this._progress]);
    }

    private HasTick()
    {
        return _ASPECT.GetPart(this.entity.aspect).GetTick() == this._ticks[this._progress];
    }

    public EnterAttack()
    {
        this._attack.Enter(this.attackDataSet[this._progress], this._skill._attackValues[this._progress])   
    }
}