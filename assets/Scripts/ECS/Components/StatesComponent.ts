import { _decorator, Component, log, Node, warn } from 'cc';
import { StateBase } from '../../Game/States/StateBase';
import { States_Define } from '../../Data/StateDefine';
const { ccclass, property } = _decorator;


@ccclass('StatesComponent')
export class StatesComponent extends Component {
    public map: Map<string, StateBase>;
    public firstState: string;
    public current: StateBase;
    public later: StateBase;

    public Init(states: object, param) {
        this.map = new Map();
        this.firstState = param.firstState || "stay";
        this.InitStates(states);
    }
    public InitStates(states) {
        for (let key in states) {
            this.AddState(key, states[key]);
        }
    }

    public AddState(stateName, statePath) {
        if (this.map.has(stateName)) {
            return;
        }
        let cls = States_Define[stateName];
        if (!cls) {
            warn("状态添加失败")
            return;
        }
        let state: StateBase = new cls();
        state.Start(statePath)
        this.map.set(stateName, state);
    }
}