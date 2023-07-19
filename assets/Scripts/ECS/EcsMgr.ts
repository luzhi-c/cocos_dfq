import { _decorator, Component, Node } from 'cc';
import { Combo } from './Combo';
import { EntityComponent } from './Factory';
const { ccclass, property } = _decorator;


@ccclass('EcsMgr')
export class EcsMgr extends Component {
    private _combos: Array<Combo> = [];
    private _combosMap = new Map<string, Array<Combo>>();
    private _addComponentCmds = [];
    private _delComponentCmds = [];
    public _AddComponent(entity: EntityComponent, key: string) {
        if (!entity[key]) {
            return;
        }
        if (!this._combosMap.has(key)) {
            this._combosMap.set(key, []);
            for (let i = 0; i < this._combos.length; i++) {
                if (this._combos[i].CheckPassed(key)) {
                    this._combosMap.get(key).push(this._combos[i]);
                }
            }
        }
        for (let i = 0; i < this._combosMap.get(key).length; i++) {
            this._combosMap.get(key)[i].AddEntity(entity);
        }
    }

    public _DelComponent(entity: EntityComponent, key) {
        if (this._combosMap.has(key)) {
            for (let i = 0; i < this._combosMap.get(key).length; i++) {
                this._combosMap.get(key)[i].DelEntity(entity, key);
            }
        }
    }

    public AddComponent(entity: EntityComponent, key, component) {
        entity[key] = component;
        this._addComponentCmds.push({ entity, key });
    }

    public DelComponent(entity: EntityComponent, key) {
        this._delComponentCmds.push({ entity, key });
    }

    public NewComboList(passMap, OnAdd?, OnDel?) {
        let combo = new Combo(passMap, OnAdd, OnDel)
        this._combos.push(combo);
        return combo.GetList();
    }

    public AddComponentTick() {
        if (this._addComponentCmds.length > 0) {
            for (let i = 0; i < this._addComponentCmds.length; i++) {
                this._AddComponent(this._addComponentCmds[i].entity, this._addComponentCmds[i].key);
            }
            this._addComponentCmds = [];
            return true;
        }
        return false;
    }

    public DelComponentTick() {
        if (this._delComponentCmds.length > 0) {
            for (let i = 0; i < this._delComponentCmds.length; i++) {
                this._DelComponent(this._delComponentCmds[i].entity, this._delComponentCmds[i].key);
            }
            this._delComponentCmds = [];
            return true;
        }
        return false;
    }
}

