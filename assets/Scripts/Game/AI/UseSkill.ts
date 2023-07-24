import { log } from "cc";
import { Container } from "../../Base/Container";
import { Timer } from "../../Base/Timer";
import { EntityComponent } from "../../ECS/Factory";
import _INPUT from "../../ECS/Service/Input";
import { _MATH } from "../../Utils/Math";
import { Point } from "../Map/Bstar";
import { SkillBase } from "../Skill/SkillBase";
import { AIBase } from "./AIBase";

export class UseSkill extends AIBase {
    public timer: Timer;
    public judgeTimeSection: Point;
    public coolDownTimeSection: Point;
    public readyTimeSection: Point;

    public _action: SkillBase; // 当前选择用的技能
    private immediately: boolean = false;

    public static NewWithConfig(entity: EntityComponent, data)
    {
        return new UseSkill(entity, data);
    }

    public constructor(entity: EntityComponent, data) {
        super(entity);
        this.Init(data);

    }

    private Init(data) {
        this.judgeTimeSection = new Point(data.judgeTime.x, data.judgeTime.y);
        this.coolDownTimeSection = new Point(data.coolDownTime.x, data.coolDownTime.y);
        this.readyTimeSection = new Point(data.readyTime.x, data.readyTime.y);
        this.timer = new Timer();
    }

    private _SkillTick(container: Container<SkillBase>) {
        if (!container) {
            return;
        }
        for (let i = 0; i < container.GetLength(); i++) {
            let skill = container.GetWithIndex(i);
            if (skill.AITick(true)) {
                log(skill.GetKey());
                return skill;
            }
        }
    }

    public Update(dt) {
        if (!this.CanRun()) {
            return false;
        }
        this.timer.Update(dt);
        if (!this.timer.isRunning) {
            if (this._action) {
                _INPUT.Press(this.entity.input, this._action.GetKey());
                // 进入随机倒计时
                let random = _MATH.RangeInt(this.coolDownTimeSection.x, this.coolDownTimeSection.y);
                this.timer.Enter(random);
                this._action = null;
            }
            else {
                let a = this.entity.skills ? this.entity.skills.container : null;
                // let b = this.entity.equipments ? this.entity.equipments.container : null;

                this._action = this._SkillTick(a);
                if (!this.immediately) {
                    let section = this._action ? this.readyTimeSection : this.judgeTimeSection;
                    let random = _MATH.RangeInt(section.x, section.y);
                    this.timer.Enter(random);
                }
                else
                {
                    this.immediately = false;
                    this.timer.Exit();
                }
                // if (this._action && this.timer.to > 0)
                // {
                    
                // }
            }
        }
        return false;
    }

    public Tick()
    {
        this._action = null;
        this.timer.Exit();
        this.immediately = true;
    }
}