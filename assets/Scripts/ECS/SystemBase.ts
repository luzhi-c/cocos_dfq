import { _decorator, Component, log, Node } from 'cc';
import { QuickList } from '../Base/QuickList';
import { EcsMgr } from './EcsMgr';
import { World } from './World';
import { EntityComponent } from './Components/EntityComponent';
const { ccclass, property } = _decorator;

@ccclass('SystemBase')
export class SystemBase extends Component {
    // system每次实例自增1
    public static _Count = 0;

    protected ID = 0;
    protected world: World;
    protected ecsMgr: EcsMgr;
    protected passMap;
    protected systemName;
    protected _list: QuickList<any>;
    protected _adds = [];
    protected _dels = [];

    public Start(world: World, ecsmgr: EcsMgr, passMap, name) {
        SystemBase._Count += 1;
        this.world = world;
        this.ecsMgr = ecsmgr;
        this.passMap = passMap;
        this.systemName = name;


        this.ID = SystemBase._Count;
        this._list = ecsmgr.NewComboList(passMap, this.Add.bind(this), this.Del.bind(this));
        this._adds = [];
        this._dels = [];
    }

    public Add(entity: EntityComponent) {
        if (this._list.GetLength() == 1) {
            this.world.AddSystem(this);
        }
        if (this._adds) {
            this._adds.push(entity);
            if (this._adds.length == 1) {
                this.world.Add(this);
            }
        }
    }

    public Del(entity: EntityComponent) {
        if (this._list.GetLength() == 0) {
            this.world.DelSystem(this);
        }
        if (this._dels) {
            this._dels.push(entity);
            if (this._dels.length == 1) {
                this.world.Del(this);
            }
        }
    }

    public GetID(): number {
        return this.ID;
    }

    public GetName(): string {
        return this.systemName;
    }

    public Enter() {
        for (let i = 0; i < this._adds.length; i++) {
            this.OnEnter(this._adds[i]);
        }
    }

    public OnEnter(entity: EntityComponent) {
        log("OnEnter");
    }

    public Init() {
        for (let i = 0; i < this._adds.length; i++) {
            this.OnInit(this._adds[i]);
        }
        this._adds = [];
    }

    public OnInit(entity: EntityComponent) {
        log("OnInit");
    }

    public Exit() {
        for (let i = 0; i < this._dels.length; i++) {
            this.OnExit(this._dels[i]);
        }
        this._dels = [];
    }

    public OnExit(entity: EntityComponent) {

    }

    public Update(dt: number, rate: number) {

    }

    public LateUpdate(dt: number, rate: number) {

    }
}

