import { _decorator, Component, Game, log, Node, sys } from 'cc';
import { EcsMgr } from './EcsMgr';
import { QuickList } from '../Base/QuickList';
import { SystemBase } from './SystemBase';
import { Factory } from './Factory';
import { GameEntry } from '../GameEntry';
import { TransformSystem } from './Systems/TransformSystem';
import { StatesSystem } from './Systems/StatesSystem';
import InputSystem from './Systems/InputSystem';
import SkillSystem from './Systems/SkillSystem';
import { Attack } from '../Game/Gear/Attack';
import { OnceplaySystem } from './Systems/OnceplaySystem';
import { EffectSystem } from './Systems/EffectSystem';
import IdentitySystem from './Systems/IdentitySystem';
import AISystem from './Systems/AISystem';
import { AttackJudge } from '../Game/AI/AttackJudge';
import { BattleJudge } from '../Game/AI/BattleJudge';
import { SearchMove } from '../Game/AI/SearchMove';
const { ccclass, property } = _decorator;

@ccclass('World')
export class World extends Component {
    // 世界暂停
    public isPause: boolean = false;
    protected _systems;
    protected _adds: Array<SystemBase> = [];
    protected _dels: Array<SystemBase> = [];
    protected _updateList = new QuickList<SystemBase>();
    protected _lateUpdateList = new QuickList<SystemBase>();
    // protected _drawList = new QuickList();
    protected _sortTick = false;

    // 启动system
    public Start() {
        
        // 启动system
        this.addComponent(EffectSystem).Start(GameEntry.World, GameEntry.EcsMgr);
        this.addComponent(TransformSystem).Start(GameEntry.World, GameEntry.EcsMgr);
        this.addComponent(StatesSystem).Start(GameEntry.World, GameEntry.EcsMgr);
        this.addComponent(OnceplaySystem).Start(GameEntry.World, GameEntry.EcsMgr);
        this.addComponent(AISystem).Start(GameEntry.World, GameEntry.EcsMgr);
        this.addComponent(SkillSystem).Start(GameEntry.World, GameEntry.EcsMgr);
        
        // 放后面
        this.addComponent(IdentitySystem).Start(GameEntry.World, GameEntry.EcsMgr);
        this.addComponent(InputSystem).Start(GameEntry.World, GameEntry.EcsMgr);
        Attack.Init();
        SearchMove.Init();
        AttackJudge.Init();
        BattleJudge.Init();
    }

    public AddSystem(system: SystemBase) {
        if (!this._updateList.HasValue(system)) {
            this._updateList.Add(system);
        }
        if (!this._lateUpdateList.HasValue(system)) {
            this._lateUpdateList.Add(system);
        }
        // if (system.Draw && !this._drawList.HasValue(system)) {
        //     this._drawList.Add(system);
        // }
        this._sortTick = true;
    }

    public DelSystem(system: SystemBase) {
        if (this._updateList.HasValue(system)) {
            this._updateList.Del(system);
        }
        if (this._lateUpdateList.HasValue(system)) {
            this._lateUpdateList.Del(system);
        }
        // if (this._drawList.HasValue(system)) {
        //     this._drawList.Del(system);
        // }
    }

    public Add(system: SystemBase) {
        this._adds.push(system);
    }

    public Del(system: SystemBase) {
        this._dels.push(system);
    }

    public Update(dt: number, rate = 1) {
        if (this.isPause) {
            return;
        }
        if (GameEntry.EcsMgr.AddComponentTick()) {
            if (this._sortTick) {
                this._updateList.Sort(this._Sorting);
                this._lateUpdateList.Sort(this._Sorting);
                // this._drawList.Sort(this._Sorting);
                this._sortTick = false;
                // for (let i = 0; i < this._updateList.GetLength(); i++) {
                //    log("排序后" ,this._updateList.Get(i).GetID())
                // }
            }
            this._adds.sort(this._Sorting);

            for (let i = 0; i < this._adds.length; i++) {
                this._adds[i].Enter();
            }
            for (let i = 0; i < this._adds.length; i++) {
                this._adds[i].Init();
            }
            this._adds = [];
        }

        for (let i = 0; i < this._updateList.GetLength(); i++) {
            this._updateList.Get(i).Update(dt, rate);
        }

        for (let i = 0; i < this._lateUpdateList.GetLength(); i++) {
            this._lateUpdateList.Get(i).LateUpdate(dt, rate);
        }

        if (GameEntry.EcsMgr.DelComponentTick()) {
            this._dels.sort(this._Sorting);
            for (let i = 0; i < this._dels.length; i++) {
                this._dels[i].Exit();
            }
            this._dels = [];
        }
    }

    private _Sorting(a: SystemBase, b: SystemBase): number {
        return a.GetID() - b.GetID();
    }
}

