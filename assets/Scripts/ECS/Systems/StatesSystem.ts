import { _decorator, Component, log, Node, Vec3 } from 'cc';
import { SystemBase } from '../SystemBase';
import { EcsMgr } from '../EcsMgr';
import { World } from '../World';
import { StatesComponent } from '../Components/StatesComponent';
import { _STATE } from '../Service/States';
import { EntityComponent } from '../Factory';
const { ccclass, property } = _decorator;

@ccclass('StatesSystem')
export class StatesSystem extends SystemBase {
    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("states", true);
        super.Start(world, ecsmgr, map,
            "states"
        );
    }

    public OnEnter(entity: EntityComponent) {
        let states: StatesComponent = entity.states;
        states.map.forEach((v, k) => {
            v.Init(entity);
        });
        _STATE.Play(states, states.firstState, true);
    }

    public Update(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e = this._list.Get(i);
            let states: StatesComponent = e.states;
            states.current.Update(dt, rate);
        }
    }

    public LateUpdate(dt: number, rate: number): void {

    }
}