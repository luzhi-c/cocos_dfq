export class _GameTime {
    private _delta = 0;
    private _stddt = 17;
    private _updateTime = 0;
    private _frame = 0;
    private _calmness = false;

    public GetDelta()
    {
        return this._stddt;
    }

    public GetFrame()
    {
        return this._frame;
    }

    public Calmness()
    {
        this._calmness = true;
    }

    public CanUpdate()
    {
        return this._updateTime >= this._stddt;
    
    }

    public Update(dt)
    {
        if (this._calmness)
        {
            this._calmness = false;
            this._delta = 0;
        }
        else
        {
            this._delta = Math.floor(dt * 1000);
        }

        this._updateTime += this._delta;
    }

    public LateUpdate()
    {
        this._updateTime -= this._stddt;
    }

    public FrameUpdate()
    {
        this._frame += 1;
    }

}
export let GameTime = new _GameTime();
window["GameTime"] = GameTime;