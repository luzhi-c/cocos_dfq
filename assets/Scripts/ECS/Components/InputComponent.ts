import { ComponentBase } from "../ComponentBase";

export default class InputComponent extends ComponentBase
{
    public map:Map<string, number>;
    public Init()
    {
        this.map = new Map();
    }
}