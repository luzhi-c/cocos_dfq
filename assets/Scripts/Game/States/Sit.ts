import { Timer } from "../../Base/Timer";
import { EntityComponent } from "../../ECS/Components/EntityComponent";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { _STATE } from "../../ECS/Service/States";
import { StateBase } from "./StateBase";

export class Sit extends StateBase {
    // 此状态无敌
    private time = 0;
    private _timer: Timer ;


    public Init(entity)
    {
        super.Init(entity);
        this._timer = new Timer();
    }
    public HandleData(data): void {
        super.HandleData(data);
        this.time = data.time;
    }
    public Enter(...params: any[]): void {
        super.Enter();
        this._timer.Enter(this.time);
    }

    public NormalUpdate(dt: number, rate: number): void {
        this._timer.Update(dt);
        if(!this._timer.isRunning)
        {
            _STATE.Play(this.entity.states, this.nextState);
        }
    }
}