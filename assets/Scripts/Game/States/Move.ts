import { Input, KeyCode, input, sp } from "cc";
import { StateBase } from "./StateBase";
import { _STATE } from "../../ECS/Service/States";
import { ControlMove } from "../../ECS/ControlMove";
import { Point } from "../Map/Bstar";
import Const from "../../Data/Const";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { EntityComponent } from "../../ECS/Factory";

export class Move extends StateBase {
    private controlMove: ControlMove;

    public Init(entity: EntityComponent) {
        super.Init(entity);
        this.controlMove = new ControlMove(this.entity.transform, this.entity.input, new Point(), true, () => {
            _STATE.Play(this.entity.states, this.nextState);
        });
    }
    public NormalUpdate(dt: number, rate: number): void {
        let speed = 3.75;
        let moveRate = 1;
        rate = moveRate * rate;
        this.controlMove.SetMoveSpeed(speed, speed * 0.6);
        if (Const.user.player == this.entity)
        {
            let main = _ASPECT.GetPart(this.entity.aspect);
            if (main && main.TickEnd())
            {
                // 播放脚步声
            }
        }
        this.controlMove.Update();
    }
}