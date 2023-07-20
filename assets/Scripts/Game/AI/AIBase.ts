import { EntityComponent } from "../../ECS/Factory";

export class AIBase {
    public entity: EntityComponent;
    public enable: boolean;
    public login: boolean;
    public constructor(entity) {
        this.entity = entity;
        this.enable = true;
        this.login = true;
    }

    public Update(dt)
    {
        return false;
    }

    public LateUpdate(dt)
    {
        return false;
    }

    public CanRun() {
        return this.enable && this.entity.ais.enable;
    }
}