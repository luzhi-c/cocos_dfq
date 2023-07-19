import { Graphics, Node } from "cc";
import { _MATH } from "../../Utils/Math";
import { GameEntry } from "../../GameEntry";

export class Rect {
    private _x: number;
    private _y: number;
    private _w: number;
    private _h: number;
    private _r: number;

    public Rotate(x, y) {
        return _MATH.RotatePoint(x, y, this._cx, this._cy, this._r);
    }

    // 转换
    private _cx: number;
    private _cy: number;
    private _xw: number;
    private _yh: number;

    // 矩形点
    private _pointList: Array<number> = new Array<number>(8);
    public constructor(x?: number, y?: number, w?: number, h?: number, r?: number, cx?: number, cy?: number) {
        this._x = x || 0;
        this._y = y || 0;
        this._w = w || 0;
        this._h = h || 0;
        this._r = r || 0;
        this._cx = cx;
        this._cy = cy;
        this.Adjust();
    }

    public Set(x: number, y: number, w: number, h: number, r?: number, cx?: number, cy?: number) {
        x = x || this._x;
        y = y || this._y;
        w = w || this._w;
        h = h || this._h;
        r = r || this._r;
        if (x != this._x || this._y != y || this._w != w || this._h != h || this._r != r || cx || cy) {
            this._x = x;
            this._y = y;
            this._w = w;
            this._h = h;
            this._r = r;
            this._cx = cx;
            this._cy = cy;
            this.Adjust();
        }
    }

    public Adjust() {
        this._xw = this._x + this._w;
        this._yh = this._y + this._h;
        this._cx = this._cx || this._x + this._w * 0.5;
        this._cy = this._cy || this._y + this._h * 0.5;
        if (this._r == 0) {
            this._pointList[0] = this._x;
            this._pointList[1] = this._y;
            this._pointList[2] = this._x;
            this._pointList[3] = this._yh;
            this._pointList[4] = this._xw;
            this._pointList[5] = this._yh;
            this._pointList[6] = this._xw;
            this._pointList[7] = this._y;
        }
        else {
            let p1 = this.Rotate(this._x, this._y);
            this._pointList[0] = p1.x;
            this._pointList[1] = p1.y;
            let p2 = this.Rotate(this._x, this._yh);
            this._pointList[2] = p2.x;
            this._pointList[3] = p2.y;
            let p3 = this.Rotate(this._xw, this._yh);
            this._pointList[4] = p3.x;
            this._pointList[5] = p3.y;
            let p4 = this.Rotate(this._xw, this._y);
            this._pointList[6] = p3.x;
            this._pointList[7] = p3.y;
        }
    }
    // 取得属性
    public Get(tag: string) {
        return this[`_${tag}`];
    }

    // public Draw()
    // {
    //     let c: Node;
    //     let g = c.addComponent(Graphics);
    //     g.moveTo();
    //     g.lineTo();
    // }

    public CheckPoint(x: number, y: number): boolean {
        let nx;
        let ny;
        if (this._r != 0) {
            this._r = - this._r;
            let p = this.Rotate(x, y);
            nx = p.x;
            ny = p.y;
            this._r = - this._r;
        }
        else {
            nx = x;
            ny = y;
        }

        if (nx < this._x || nx > this._xw || ny < this._y || ny > this._yh) {

            return false;
        }
        return true;
    }

    public CheckRect(rect: Rect) {
        let lx = Math.max(this._x, rect.Get("x"));
        let ly = Math.max(this._y, rect.Get("y"));
        let rx = Math.min(this._xw, rect.Get("xw"));
        let ry = Math.min(this._yh, rect.Get("yh"));

        let result: any = {};
        if (lx > rx || ly > ry) {
            result.isDone = false;
        }
        else {
            result.isDone = true;
            result.x = lx + (rx - lx) * 0.5;
            result.y = ly + (ry - ly) * 0.5;
        }
        return result;
    }

    public CheckPointByPoint(rect: Rect) {
        return this.CheckPoint(rect.Get("x"), rect.Get("y"));
    }

    public Draw()
    {
        let g = GameEntry.gl;
        g.moveTo(this._pointList[0], -this._pointList[1]);
        g.lineTo(this._pointList[2], -this._pointList[3]);
        g.lineTo(this._pointList[6], -this._pointList[7]);

        g.moveTo(this._pointList[4], -this._pointList[5]);
        g.lineTo(this._pointList[2], -this._pointList[3]);
        g.lineTo(this._pointList[6], -this._pointList[7]);
        g.stroke();
    }
}