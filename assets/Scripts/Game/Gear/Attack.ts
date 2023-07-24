import { log } from "cc";
import { Gear } from "../../Base/Gear";
import { QuickList } from "../../Base/QuickList";
import { Timer } from "../../Base/Timer";
import Const from "../../Data/Const";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { GameEntry } from "../../GameEntry";
import { BaseRender } from "../../Render/BaseRender";
import { SolidRect } from "../Map/SolidRect";
import { _BATTLE } from "../../ECS/Service/Battle";
import { AttackValue } from "../Skill/SkillBase";
import { AttackDataSet } from "../States/StateBase";
import { _STATE } from "../../ECS/Service/States";
import { EntityComponent, Factory } from "../../ECS/Factory";
import { _MATH } from "../../Utils/Math";

type AttackResult =
    {
        isDone: boolean;
        x: number;
        y: number;
        z: number;
        direction: number;
    }

export class Attack extends Gear {
    private static _defaultCollision = { "body": "attack" };
    private static _list: QuickList<EntityComponent>;
    private entity: EntityComponent;
    private _hasAttacked = false;
    private _hasAttackedMap = new Map();
    private _timer: Timer = new Timer();
    public collision: Map<BaseRender, string> = new Map();

    private attackDataSet: AttackDataSet;

    public static Init() {
        let map = new Map();
        map.set("transform", true);
        map.set("aspect", true);
        // map.set("battle" , true);
        // map.set("attacker" , true);
        this._list = GameEntry.EcsMgr.NewComboList(map);
    }

    public constructor(entity: EntityComponent) {
        super();
        this.entity = entity;
    }

    private IsPlayer(entity: EntityComponent) {
        if (entity == Const.user.player) {
            return true;
        }
        return false;
    }

    public Enter(data: AttackDataSet, attackValue?: AttackValue, Hit?, Collide?, noCollision?): void {
        super.Enter();
        this.Reload();
        this.collision.clear();
        this.attackDataSet = data;
        let collision = data.collision || Attack._defaultCollision;
        if (!noCollision) {
            for (let key in collision) {
                let r = _ASPECT.GetPart(this.entity.aspect, key);
                this.collision.set(r, collision[key]);
            }
        }
        if (data.interval) {
            this._timer.Enter(data.interval);
        }
        else {
            this._timer.Exit();
        }
    }

    private Reload() {
        this._hasAttacked = false;
        this._hasAttackedMap.clear();
    }

    public Update(dt: number): void {
        if (!this.isRunning) {
            return;
        }
        if (this._timer.isRunning) {
            this._timer.Update(dt);
            if (!this._timer.isRunning) {
                this.Reload();
                this._timer.Enter();
            }
        }
        let noCollider = true;
        this.collision.forEach((value, key) => {
            let collider = key.GetCollider();
            if (collider) {
                noCollider = false;
            }
        })
        if (noCollider) {
            return;
        }
        let isPlayer = this.IsPlayer(this.entity);
        for (let i = 0; i < Attack._list.GetLength(); i++) {
            let e = Attack._list.Get(i);
            if (!this._hasAttackedMap.has(e)) {
                let result = Attack.Collide(this, e);
                if (result.isDone) {
                    // 判断攻击的方向
                    let ax = this.entity.transform.position.x;
                    this._hasAttackedMap.set(e, true);
                    let isTurn = _BATTLE.Turn(e.transform, ax);

                    let hitDirection = -e.transform.direction;
                    // 对敌人顿帧
                    if (this.attackDataSet.hitstop) {
                        let hitstop = this.attackDataSet.hitstop;
                        hitstop = _MATH.RangeInt(1, 2) == 1 ? hitstop * 2 : hitstop;
                        _BATTLE.HitStop(e.attacker, e.identity, hitstop);
                    }
                    // 对自己顿帧
                    if (this.attackDataSet.selfstop) {
                        let selfstop = this.attackDataSet.selfstop;
                        selfstop = _MATH.RangeInt(1, 2) == 1 ? selfstop * 2 : selfstop;
                        _BATTLE.HitStop(this.entity.attacker, this.entity.identity, selfstop);
                    }
                    if (e.states) {
                        let hasOverturn = false; // 强制位移
                        let hasFlight = false; // 击飞
                        if (!hasOverturn && this.attackDataSet.flight) {
                            let flight = this.attackDataSet.flight;
                            let flightDirection = flight.direction ? flight.direction * hitDirection : hitDirection;

                            hasFlight = _BATTLE.Flight(e.states, flight.power_z, null, null, flight.power_x, null, flightDirection);
                        }

                        if (!hasFlight) {
                            if (e.transform.position.z < 0 && _STATE.HasTag(e.states, "jump")) {
                                _BATTLE.Flight(e.states);
                            }
                            else {
                                let stun = this.attackDataSet.stun;
                                let stunDirection = stun.direction ? stun.direction * hitDirection : hitDirection;
                                _BATTLE.Stun(e.states, stun.time, stun.power, stun.speed, stunDirection);
                            }
                        }

                    }

                    let params = {
                        x: result.x,
                        y: e.transform.position.y,
                        z: result.z,
                        direction: this.entity.transform.direction,
                        entity: e
                    };

                    this.NewEffect(this.attackDataSet.effect, params);

                }
            }
        }
    }

    public static Collide(attack: Attack, entity: EntityComponent): AttackResult {
        let result: any = {};
        if (attack.entity == entity) {
            result.isDone = false;
            return result;
        }
        let beaten = _ASPECT.GetBodySolidRectList(entity.aspect);
        attack.collision.forEach((value, key) => {
            let collider = key.GetCollider();
            if (collider) {
                let attack = collider.GetList(value);
                let colliderResult = SolidRect.CollideWithList(beaten, attack);

                if (colliderResult.isDone) {
                    result.isDone = colliderResult.isDone;
                    result.x = colliderResult.x;
                    result.y = colliderResult.y;
                    result.z = colliderResult.z;
                    return result;
                }
            }
        })
        return result;
    }

    public NewEffect(effect: string, params: any) {
        Factory.New(effect, params, "effect");
    }
}