import { Container } from "../../Base/Container";
import { AIBase } from "../../Game/AI/AIBase";
import { ComponentBase } from "../ComponentBase";

export class AIComponent extends ComponentBase {
    public data;
    public enable: boolean = false;
    public container: Container<AIBase>;

    public Init(data): void {
        this.data = data;
        this.container = new Container();
        this.enable = true;
    }
}