import { Graphics } from "cc";
import { Rect } from "./Rect";

export type CollideResult =
    {
        isDone: boolean;
        x: number;
        y: number;
        z: number;
    }

type RectGroup =
    {
        xy: Rect;
        xz: Rect;
    }

export class SolidRect {
    private _x: number;
    private _y: number;
    private _z: number;
    private _sx: number;
    private _sy: number;
    private _r: number;
    private _struct: any;
    private _rectGroup: RectGroup;
    public constructor(x: number, y1: number, y2: number, z: number, w: number, h: number) {
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._sx = 1;
        this._sy = 1;
        this._r = 0;
        this._struct = {
            x: 0,
            y1: 0,
            y2: 0,
            z: 0,
            w: 0,
            h: 0
        };

        this._rectGroup =
        {
            xy: new Rect(),
            xz: new Rect(),
        }
        this.SetStruct(x, y1, y2, z, w, h);
    }

    public Set(x?, y?, z?, sx?, sy?, r?) {
        this._x = x || this._x
        this._y = y || this._y
        this._z = z || this._z
        this._sx = sx || this._sx
        this._sy = sy || this._sy
        this._r = r || this._r

        this.Adjust();
    }

    public Get(name) {

        return this[`_${name}`]
    }

    public SetStruct(x: number, y1: number, y2: number, z: number, w: number, h: number) {
        this._struct.x = x;
        this._struct.y1 = y1;
        this._struct.y2 = y2;
        this._struct.z = z;
        this._struct.w = w;
        this._struct.h = h;

        this.Adjust();
    }

    public GetStruct(name) {

        return this._struct[name]
    }


    public Adjust() {
        let x = this._x + this._struct.x * this._sx
        let w = this._struct.w * Math.abs(this._sx)

        let y1 = this._y + this._struct.y1 * this._sy
        let h1 = (this._struct.y2 - this._struct.y1) * Math.abs(this._sy)

        let y2 = this._y + this._z + (-this._struct.z - this._struct.h) * Math.abs(this._sy)
        let h2 = this._struct.h * Math.abs(this._sy)

        if (this._sx < 0) {
            x = x - w
        }

        if (this._sy < 0) {
            y1 = y1 - h1
            y2 = y2 - h2
        }

        this._rectGroup.xy.Set(x, y1, w, h1, this._r, this._x, this._y)
        this._rectGroup.xz.Set(x, y2, w, h2, this._r, this._x, this._y)
    }

    public Collide(solidRect: SolidRect): CollideResult {
        let xy = this._rectGroup.xy.CheckRect(solidRect._rectGroup.xy);
        let xz = this._rectGroup.xz.CheckRect(solidRect._rectGroup.xz);

        let result: any = {};
        if (xy.isDone && xz.isDone) {
            result.isDone = true;
            result.x = xz.x;
            result.y = this._y;
            result.z = xz.y - this._y;

        }
        else {
            result.isDone = false;
        }
        return result
    }

    public CheckPoint(x: number, y: number, z?: number) {
        return this._rectGroup.xy.CheckPoint(x, y);
    }

    public static CollideWithList(a: SolidRect[], b: SolidRect[]):CollideResult {
        let result: any = {};
        result.isDone = false;
        if (!a || !b) {
            return result;
        }
        for (let n = 0; n < a.length; n++) {
            for (let m = 0; m < b.length; m++) {
                let r = a[n].Collide(b[m]);
                if (r.isDone) {
                    result.isDone = true;
                    result.x = r.x;
                    result.y = r.y;
                    result.z = r.z;
                    return result;
                }
            }
        }
        return result;
    }

    public Draw()
    {
        this._rectGroup.xy.Draw();
        this._rectGroup.xz.Draw();
    }
}