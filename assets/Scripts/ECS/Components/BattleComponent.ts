import { Caller } from "../../Base/Caller";
import { Point3 } from "../../Game/Map/Bstar";
import { ComponentBase } from "../ComponentBase";
import { EntityComponent } from "../Factory";

// 人物状态
export type BanCountMap =
    {
        stun?: number; // 击退状态
        flight?: number; // 击飞状态
        overturn?: number; // 强制控制状态
        dmgSound?: number; // 受伤音效
        attack?: number;
        turn?: number;
        die?: number;
        hide?: number;
        pure?: number;
    }

export type BeatenConfig = {

    position?: Point3; // 伤害位置
    damage?: number;  // 伤害
    direction?: number; // 方向
    isPhysical?: boolean; // 是否物理
    isCritical?: boolean; // 是否暴击
    isTurn?: boolean;
    element?: string;   // 属性攻击
    entity?: EntityComponent;
    attack?: number;
}

// 人物战斗相关属性
export class BattleComponent extends ComponentBase {
    public camp: number = 0; // 阵营
    public deadProgress: number = 0; // 死亡进程 判断播放死亡动画 
    public overKill: boolean = false;
    public beatenCaller: Caller;
    public deadCaller: Caller;
    public hasEffect: boolean = false; // 死亡时是否播放动画
    public banCountMap: BanCountMap = {};
    public beatenConfig: BeatenConfig = {};

    public Init(data, param): void {

        this.camp = param.camp || data.camp || 0;
        this.deadProgress = 0;
        this.beatenCaller = new Caller();
        this.deadCaller = new Caller();

        let banCountMap = data.banCountMap || {};
        this.banCountMap = {
            stun: banCountMap.stun || 0,
            flight: banCountMap.flight || 0,
            overturn: banCountMap.overturn || 0,
            dmgSound: banCountMap.dmgSound || 0,
            attack: banCountMap.attack || 0,
            turn: banCountMap.turn || 0,
            die: banCountMap.die || 0,
            hide: banCountMap.hide || 0,
            pure: banCountMap.pure || 0,

        };

        this.beatenConfig = {
            position: new Point3(),
            damage: 0,
            direction: 0,
            isPhysical: false,
            isCritical: false,
            isTurn: false,
            element: "",
            entity: null,
            attack: null
        }
    }
}