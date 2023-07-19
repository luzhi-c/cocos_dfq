import { log } from "cc";
import { Timer } from "../../Base/Timer";
import { EntityComponent } from "../../ECS/Components/EntityComponent";
import { _ASPECT } from "../../ECS/Service/Aspect";
import _INPUT from "../../ECS/Service/Input";
import { _STATE } from "../../ECS/Service/States";

export type AttackValue =
    {
        damageRate: number;
        isPhysical: boolean;
    }


export class SkillBase {
    private entity: EntityComponent;

    private key: string;
    private _timer: Timer;
    private state: string;
    private time: number;
    public order: number;
    public _attackValues: AttackValue[];
    // private duraMax: number;
    // private dura: number;
    private isCombo = false;
    public constructor(entity: EntityComponent, key: string, data) {
        this.entity = entity;
        this.key = key;

        this._timer = new Timer();
        this.time = data.time || 0;
        this.order = data.order || 0;
        this.state = data.state;
        this._attackValues = data.attackValues;
    }

    public Update(dt: number, rate: number) {
        if (this._timer.isRunning) {
            this._timer.Update(dt);
            // if (!this._timer.isRunning && this.duraMax)
            // {

            // }
        }
        if (this.CanUse() && _INPUT.IsPressed(this.entity.input, this.key)) {

            this.Use();
        }
    }

    public CanUse() {
        return !this.InCoolDown() && this.Cond();
    }

    public InCoolDown() {
        return this._timer.isRunning;
    }
    // 是否释放的条件
    public Cond() {
        let isSame = this.entity.states.current.GetName() == this.state;
        return _STATE.HasTag(this.entity.states, "free") || (this.isCombo && isSame) || (_STATE.HasTag(this.entity.states, "cancel") && !isSame);
    }

    public Use() {
        this.CoolDown();
        this.isCombo = false;
        if (this.state) {
            _STATE.Play(this.entity.states, this.state, false, this);
        }
    }
    // 进入冷却
    public CoolDown(isForce?: boolean) {
        if (!isForce && this._timer.isRunning) {
            return;
        }
        this._timer.Enter(this.time);
    }

    public Reset() {
        this._timer.Exit();
        this.isCombo = true;
    }
}