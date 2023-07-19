import { EntityComponent } from "../../ECS/Components/EntityComponent";
import { StateBase } from "./StateBase";
import { _STATE } from "../../ECS/Service/States";
import _INPUT from "../../ECS/Service/Input";
import Const from "../../Data/Const";

export class Stay extends StateBase {
    public Init(entity: EntityComponent) {
        super.Init(entity);
    }
    public NormalUpdate(dt: number, rate: number): void {
        for (let i = 0; i < Const.arrow.length; i++) {
            if (_INPUT.IsHold(this.entity.input, Const.arrow[i])) {
                _STATE.Play(this.entity.states, this.nextState);
                return;
            }
        }
    }
}