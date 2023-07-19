import { Down } from "../Game/States/Down";
import { Flight } from "../Game/States/Flight";
import { Move } from "../Game/States/Move";
import { NormalAttack } from "../Game/States/NormalAttack";
import { Sit } from "../Game/States/Sit";
import { Stay } from "../Game/States/Stay";
import { Stun } from "../Game/States/Stun";

// 状态定义
export namespace States_Define {
     export const stay = Stay;
     export const move = Move;
     export const stun = Stun;
     export const flight = Flight;
     export const down = Down;
     export const sit = Sit;
     export const normalAttack = NormalAttack;
}