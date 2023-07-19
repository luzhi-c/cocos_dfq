import { GameEntry } from "../../GameEntry";
import { _MATH } from "../../Utils/Math";
import InputComponent from "../Components/InputComponent";
import { TransformComponent } from "../Components/TransformComponent";
import _INPUT from "./Input";

export class Motion {
    public static Move(transform: TransformComponent, type: string, value: number) {
        value = _MATH.GetFixedDecimal(value);

        let matrix = GameEntry.GameMap.GetMatrix();
        if (type == "z") {
            transform.position.z += value;
        }
        else {
            let nx = matrix.ToNode(transform.position.x, "x");
            let ny = matrix.ToNode(transform.position.y, "y");
            let isCross = false;
            let isX = type == "x";
            let direction = _MATH.GetDirection(value);
            let newPos = transform.position[type] + value;
            let target = matrix.ToNode(newPos, type);
            let current = isX ? nx : ny;
            let range = Math.abs(current - target);

            for (let n = 1; n <= range; n++) {
                let isObs = false;

                if (isX) {
                    isObs = matrix.GetNode(nx + direction * n, ny, true);
                }
                else {
                    isObs = matrix.GetNode(nx, ny + direction * n, true);
                }
                if (isObs) {
                    if (direction > 0) {
                        transform.position[type] = matrix.ToPosition(current + n, type) - 1;
                    }
                    else {
                        transform.position[type] = matrix.ToPosition(current - n + 1, type);
                    }

                    isCross = true;
                    break;
                }

            }
            if (!isCross) {
                transform.position[type] = newPos;
            }
            else {
                // 回调遇到障碍物
                //transform.obstructCaller.Call();
            }
        }

        transform.positionTick = true
    }

    public static TurnDirection(transform: TransformComponent, input: InputComponent) {
        let arrowDirection = _INPUT.GetArrowDirection(input, transform.direction);
        if (arrowDirection == -1) {
            transform.direction = -transform.direction;
            transform.scaleTick = true;
        }
    }

}