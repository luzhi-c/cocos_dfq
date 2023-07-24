import { _decorator, Component, Node } from 'cc';
import { QuickList } from '../Base/QuickList';
import { EntityComponent } from './Factory';
const { ccclass, property } = _decorator;

@ccclass('Combo')
export class Combo {
    protected list: QuickList<EntityComponent>;
    protected passMap: Map<string, boolean>;
    protected OnAdd: Function;
    protected OnDel: Function;
    protected OnInit: Function;
    public constructor(passMap: Map<string, boolean>, OnAdd = null, OnDel = null, OnInit = null) {
        this.list = new QuickList();
        this.passMap = passMap;

        this.OnAdd = OnAdd;
        this.OnDel = OnDel;
        this.OnInit = OnInit;
    }

    public Filter(entity): boolean {
        for (let key in this.passMap.keys()) {
            if (!entity[key]) {
                return false;
            }
        }
        return true;
    }

    public CheckPassed(key): boolean {
        return this.passMap.has(key);
    }

    public GetList() {
        return this.list;
    }

    public AddEntity(entity): boolean {
        if (!this.list.HasValue(entity) && this.Filter(entity)) {
            this.list.Add(entity);
            this.OnAdd && this.OnAdd(entity);
            return true;
        }
        return false
    }

    public DelEntity(entity, key): boolean {
        if (this.list.HasValue(entity) && this.CheckPassed(key)) {
            this.list.Del(entity);
            this.OnDel && this.OnDel(entity);
            return true;
        }
        return false
    }
}

