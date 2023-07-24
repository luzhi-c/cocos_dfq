import { ComponentBase } from "../ComponentBase";

export class DuelistComponent extends ComponentBase
{
    public weight: number = 0; // 质量
    public moveSpeed: number = 0;

    public Init(data, param): void {
        this.moveSpeed = data.moveSpeed || 2;
        this.weight = data.weight || 0;
        this.weight = this.weight + 1;
    }
}