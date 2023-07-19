import { _decorator, Component, Node } from 'cc';
import { EntityComponent } from "./Components/EntityComponent";
const { ccclass, property } = _decorator;
@ccclass('ComponentBase')
export class ComponentBase extends Component
{
    public entity: EntityComponent;
    public Init(...param)
    {
        
    }

    public Enter(entity: EntityComponent)
    {
        this.entity = entity;
    }
}

