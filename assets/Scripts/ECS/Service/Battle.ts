import { AttackerComponent } from "../Components/AttackerComponent";
import { IdentityComponent } from "../Components/IdentityComponent";
import { StatesComponent } from "../Components/StatesComponent";
import { TransformComponent } from "../Components/TransformComponent";
import { _STATE } from "./States";

export class _BATTLE {
    // 打击顿帧 卡顿 卡肉感
    public static HitStop(attacker: AttackerComponent, identity: IdentityComponent, time: number, disableAttack?: boolean)
    {
        identity.isPaused = time > 0;
        attacker.stopTimer.Enter(time);
        if (disableAttack)
        {
            attacker.enable = !disableAttack;
        }
        else
        {
            attacker.enable = true;
        }
    }

    // 强制转向
    public static Turn(transform: TransformComponent, x, direction?: number) {
        let origin = transform.direction;
        if (x && !direction) {
            let px = transform.position.x;
            if (x > px) {
                transform.direction = 1;
            }
            else {
                transform.direction = -1;
            }
        }
        else if (direction) {
            transform.direction = direction;
        }
        if (origin != transform.direction) {
            transform.scaleTick = true;
            return true;
        }
        return false;
    }
    // 击退
    public static Stun(states: StatesComponent, time, power?: number, speed?: number, direction?: number, flagMap?: any, Func?: Function) {
        if (_STATE.HasTag(states, "fall") || _STATE.HasTag(states, "overturn") || _STATE.HasTag(states, "jump")) {
            return false
        }
        power = power || 0;
        return _STATE.Play(states, "stun", false, time, power, speed, direction, flagMap, Func);
    }
    // 击飞
    public static Flight(states: StatesComponent, power_z?, speed_up?, speed_down?, power_x?, speed_x?, direction?) {
        power_z = power_z || 0
        speed_up = speed_up || 0.417
        speed_down = speed_down || 0.501
        power_x = power_x || 0
        speed_x = speed_x || 0
        direction = direction || 1
        return _STATE.Play(states, "flight", false, power_z, speed_up, speed_down, power_x, speed_x, direction);
    }

}