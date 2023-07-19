import { ComponentBase } from "../ComponentBase";
import { EntityComponent } from "../Factory";


export class IdentityComponent extends ComponentBase {
    public destroyProcess: number = 0;
    public rate: number = 1;
    public isPaused: boolean = false;
    public id: number = 0;

    public superior: EntityComponent;
    public Init(data, param, id): void {
        this.id = id;
        param = param = {};
        this.superior = param.entity;
    }
}