export class Range {
    public xa: number;
    public xb: number;
    public ya: number;
    public yb: number;
    public constructor(xa?, ya?, xb?, yb?) {
        this.xa = xa || 0
        this.xb = xb || 0
        this.ya = ya || 0
        this.yb = yb || 0
    }

    public Set(xa?, ya?, xb?, yb?) {
        this.xa = xa || this.xa;
        this.xb = xb || this.xb;
        this.ya = ya || this.ya;
        this.yb = yb || this.yb;
    }

    public Collide(x, y, ox, oy)
    {
        return ox > x + this.xa && ox < x + this.xb && oy > y + this.ya && oy < y + this.yb;
    }
}