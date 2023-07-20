import { Vec2 } from "cc";
import { Rect } from "./Rect";
import BStar, { Point } from "./Bstar";
import { _MATH } from "../../Utils/Math";

// 地图矩阵 格子
export class Matrix {
    public gridSize: number = 16;
    private _rect: Rect;

    private _bStar: BStar;
    public _openNodes: Array<Array<number>> = [];
    public constructor(gridSize?: number, x?: number, y?: number, w?: number, h?: number) {
        this.gridSize = gridSize || 16;
        this._bStar = new BStar();
        this._rect = new Rect();
        if (x && y && w && h) {
            this.Reset(x, y, w, h);
        }
    }

    public Reset(x?: number, y?: number, w?: number, h?: number, initOpenNodes?: boolean) {
        this._rect.Set(x, y, w, h);
        this._bStar.Reset(this.ToNode(w), this.ToNode(h));
        if (initOpenNodes) {
            this.InitOpenNodes();
        }
    }

    public SetNode(x: number, y: number, isObs?: boolean, isOrigin?: boolean) {
        if (!isOrigin) {
            x = this.ToNode(x, "x");
            y = this.ToNode(y, "y");
        }
        if (this.GetNode(x, y, true) == isObs) {
            return;
        }
        // 可以优化为二分查找
        let pos = this._openNodes[y].findIndex((v) => {
            return v == x;
        });
        if (isObs) {
            if (pos != -1) {
                this._openNodes[y].splice(pos, 1);
            }
        }
        else {
            if (pos == -1) {
                this._openNodes[y].splice(pos, 0, x);
            }
        }

        this._bStar.SetNode(x, y, isObs);
    }

    public SetNodeWithRect(rect: Rect, isObs?: boolean) {
        let x = this.ToNode(rect.Get("x"), "x");
        let y = this.ToNode(rect.Get("y"), "y");
        let xw = this.ToNode(rect.Get("xw"), "x");
        let yh = this.ToNode(rect.Get("yh"), "y");
        for (let n = 0; n < xw; n++) {
            for (let m = 0; m < yh; m++) {
                this._bStar.SetNode(n, m, isObs)
            }
        }
    }

    public GetNode(x: number, y: number, isOrigin?: boolean) {
        if (!isOrigin) {
            x = this.ToNode(x, "x");
            y = this.ToNode(y, "y");
        }
        return this._bStar.GetNode(x, y);
    }


    public ToNode(value: number, type?: string, correct?: boolean) {
        if (type) {
            value = value - this._rect.Get(type);
        }
        let v = Math.floor(value / this.gridSize);
        if (type && correct) {
            if (v < 0) {
                v = 0;
            }
            else {
                let vv = type == "x" ? this.GetWidth() : this.GetHeight();
                v = v > vv ? vv : v;
            }
        }
        return v;
    }

    public ToPosition(value: number, type: string, isCenter?: boolean) {
        value = value * this.gridSize;
        if (type) {
            value += this._rect.Get(type);
        }
        if (isCenter) {
            value += this.gridSize * 0.5;
        }
        return value;
    }

    public GetGridSize() {
        return this.gridSize;
    }

    public GetWidth(isOrigin?: boolean) {
        let width = this._bStar.GetWidth();
        width = isOrigin ? width * this.gridSize : width;
        return width;
    }

    public GetHeight(isOrigin?: boolean) {
        let height = this._bStar.GetHeight();
        height = isOrigin ? height * this.gridSize : height;
        return height;
    }

    public InitOpenNodes() {
        this._openNodes = [];
        for (let n = 0; n < this.GetHeight(); n++) {
            this._openNodes[n] = [];
            for (let m = 0; m < this.GetWidth(); m++) {
                if (!this.GetNode(m, n, true)) {
                    this._openNodes[n].push(m);
                }
            }
        }

    }

    // 寻路并优化
    public GetPath(x1: number, y1: number, x2: number, y2: number): Array<Point> {
        x1 = this.ToNode(x1, "x")
        y1 = this.ToNode(y1, "y")
        x2 = this.ToNode(x2, "x")
        y2 = this.ToNode(y2, "y")
        let path = this._bStar.GetPath(x1, y1, x2, y2)
        if (!path) {
            return;
        }
        let shift = this.gridSize * 0.5;
        let x = path[path.length - 1].x;
        let y = path[path.length - 1].y;
        let type: string;
        for (let i = path.length - 1; i >= 0; i--) {
            if (type) {
                if ((type == "x" && x != path[i].x) || (type == "y" && y != path[i].y)) {
                    type = null;
                }
                else if (x == path[i].x && y == path[i].y) {
                    path.splice(i, 1);
                }
            }
            if (!type) {
                if (x == path[i].x) {
                    type = "x";
                }
                else if (y == path[i].y) {
                    type = "y";
                }
            }
        }

        for (let i = 0; i < path.length; i++) {
            path[i].x = this.ToPosition(path[i].x, "x") + shift;
            path[i].y = this.ToPosition(path[i].y, "y") + shift;
        }
        return path;
    }

    public Assign(Add, count, isFree) {
        let i = 0;
        while (i < count) {
            let n = _MATH.RangeInt(0, this._openNodes.length);
            if (this._openNodes[n].length > 0) {
                let m = this._openNodes[n][_MATH.RangeInt(1, this._openNodes[n].length)];
                let x = this.ToPosition(m, "x", true);
                let y = this.ToPosition(n, "y", true);
                Add(x, y, i);
                if (!isFree) {
                    this.SetNode(x, y, true, true);
                }
                i++;
            }
            else {
                break;
            }
        }
    }

}