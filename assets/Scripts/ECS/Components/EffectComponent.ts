import { StateBase } from "../../Game/States/StateBase";
import { ComponentBase } from "../ComponentBase";

export class EffectComponent extends ComponentBase
{
    public lockStop: boolean = false;
    public lockRate: boolean = false;
    public lockDirection: boolean = false;
    public lockAlpha: boolean = false;
    public lockState: boolean = false;
    public lockLife: boolean = false;

    public positionType: string;
    public adapt:any;

    public state: StateBase;

    public height: number = 0;
    public Init(data, param): void {
        data = data || {};
        this.lockStop = data.lockStop || false;
        this.lockRate = data.lockRate || false;
        this.lockDirection = data.lockDirection || false;
        this.lockAlpha = data.lockAlpha || false;

        if (data.lockState && param.entity && param.entity.states){
            this.state = param.entity.states.current;
        }
        if (data.lockLife != null)
        {
            this.lockLife = data.lockLife;
        }
        else
        {
            this.lockLife = true;
        }
        this.positionType = data.positionType;
        this.adapt = data.adapt;
    }

}