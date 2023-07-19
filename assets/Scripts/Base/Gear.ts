export class Gear {
    public isRunning = false;
    public constructor() {

    }

    public Update(dt: number) {

    }

    public Enter(...params)
    {
        this.isRunning = true;
    }

    public Exit()
    {
        this.isRunning = false;
    }
}