import { Timer } from "../../Base/Timer";
import { ComponentBase } from "../ComponentBase";

export class OnceplayComponent extends ComponentBase {
    public timer: Timer;
    public type: string;
    public objs: any;
    public Init(data, param): void {
        data = data || {};
        param = param || {};

        this.type = data.type;
        this.objs = data.objs;
        let time = data.time || param.onceplay_time;
        if (time) {
            this.timer = new Timer(time);
        }
        else {
            this.type = this.type || "normal";
        }

    }


}