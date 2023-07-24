import { Caller } from "../../Base/Caller";
import { Timer } from "../../Base/Timer";
import { ComponentBase } from "../ComponentBase";

export class AttackerComponent extends ComponentBase
{
    public stopTimer:Timer;
    public hitCaller: Caller;
    public enable: boolean = false;

    public Init(data, param): void {
        this.stopTimer = new Timer();
        this.hitCaller = new Caller();
        this.enable = true;
    }

}