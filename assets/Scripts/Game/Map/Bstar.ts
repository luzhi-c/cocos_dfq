export class Point {
    public x: number;
    public y: number;

    public constructor(x?, y?) {
        this.x = x || 0;
        this.y = y || 0;
    }

    public Set(x, y) {
        this.x = x || this.x;
        this.y = y || this.y;
    }
}

export class Point3 {
    public x: number;
    public y: number;
    public z: number;

    public constructor(x?, y?, z?) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    public Set(x?, y?, z?) {
        this.x = x || this.x;
        this.y = y || this.y;
        this.z = z || this.z;
    }
}

export class PathNode {
    public x: number;
    public y: number;
    public preGrade: number;
    public savePath: Array<Point>;
}

export default class BStar {
    private _rule = [
        [0, - 1],
        [0, 1],
        [- 1, 0],
        [1, 0],
        [- 1, -1],
        [1, - 1],
        [- 1, 1],
        [1, 1]
    ];
    private _width: number;
    private _height: number;
    private _openList: Array<PathNode> = [];
    private _rangeMat: Map<number, Map<number, boolean>> = new Map();
    private _closeMat: Map<number, Map<number, boolean>> = new Map();
    private _fenceMat: Map<number, Map<number, boolean>> = new Map();

    public constructor() {

    }

    public Reset(w: number, h: number) {
        this._fenceMat.clear();
        this._rangeMat.clear();
        this._closeMat.clear();

        this._width = w;
        this._height = h;

        for (let i = 0; i < w; i++) {
            this._fenceMat.set(i, new Map());
            this._rangeMat.set(i, new Map());
            this._closeMat.set(i, new Map());
            for (let j = 0; j < h; j++) {
                this._rangeMat.get(i).set(j, true);
            }
        }
    }

    public GetWidth() {
        return this._width;
    }

    public GetHeight() {
        return this._height;
    }

    public SetNode(x, y, isObs = false) {
        if (this._fenceMat.has(x)) {
            this._fenceMat.get(x).set(y, isObs);
        }
    }

    // 像素转格子 返回是不是障碍物
    public GetNode(x, y): boolean {
        if (!this.InScope(x, y)) {
            return true;
        }
        if (this._fenceMat.has(x)) {
            return this._fenceMat.get(x).get(y);
        }
        return true;
    }

    public GetOpenNode(x, y): Point {
        if (!this.InScope(x, y)) {
            return;
        }
        let add = 1;
        while (true) {
            for (let i = 0; i < 8; i++) {
                let nodex = x + this._rule[i][0] * add;
                let nodey = y + this._rule[i][1] * add;

                if (this._rangeMat.has(nodex) && this._rangeMat.get(nodex).get(nodey) && !this._fenceMat.get(nodex).get(nodey) && nodex != x && nodey != y) {
                    return new Point(nodex, nodey);
                }
            }
            add++;
        }
    }




    private _EnumNode_Sub(x1: number, y1: number, x2: number, y2: number, path: Array<Point>, isFourAxis: boolean) {
        let start = 0;
        let end = 0;
        let num = 0;
        if (isFourAxis) {
            start = 0;
            end = 4;
            num = 10;
        }
        else {
            start = 4;
            end = 8;
            num = 14;
        }
        for (let i = start; i < end; i++) {
            let nodex = x1 + this._rule[i][0];
            let nodey = y1 + this._rule[i][1];
            if (this._rangeMat.has(nodex) && this._rangeMat.get(nodex).get(nodey)
                && !this._closeMat.get(nodex).get(nodey) && !this._fenceMat.get(nodex).get(nodey)
            ) {
                let cond = true;
                if (!isFourAxis) {
                    cond = this._closeMat.get(nodex).get(y1) || this._closeMat.get(x1).get(nodey);
                }
                if (cond) {
                    this._closeMat.get(nodex).set(nodey, true);

                    let f = (Math.abs(x2 - nodex) + Math.abs(y2 - nodey)) * 10 + num;

                    let pPath: Array<Point> = [];
                    for (let n = 0; n < path.length; n++) {
                        pPath.push(path[n]);
                    }
                    pPath.push(new Point(nodex, nodey));

                    let point = -1;
                    for (let m = 0; m < this._openList.length; m++) {
                        if (f <= this._openList[m].preGrade) {
                            point = m;
                            let pathNode: PathNode = new PathNode();
                            pathNode.x = nodex;
                            pathNode.y = nodey;
                            pathNode.preGrade = f;
                            pathNode.savePath = pPath;
                            this._openList.splice(m, 0, pathNode);
                            break;
                        }
                    }
                    if (point == -1) {
                        let pathNode: PathNode = new PathNode();
                        pathNode.x = nodex;
                        pathNode.y = nodey;
                        pathNode.preGrade = f;
                        pathNode.savePath = pPath;
                        this._openList.push(pathNode);
                    }
                }
            }
        }
    }
    private _EnumNode(x1, y1, x2, y2, path) {
        this._EnumNode_Sub(x1, y1, x2, y2, path, true)
        this._EnumNode_Sub(x1, y1, x2, y2, path, false)
    }

    // 在不在范围内
    private InScope(x, y) {
        if (x < 0 || x > this._width || y < 0 || y > this._height) {
            return false
        }
        return true
    }


    public GetPath(x1, y1, x2, y2): Array<Point> {
        if (!this.InScope(x1, y1) || !this.InScope(x2, y2)) {
            return;
        }
        // 清空数据
        this._openList = [];
        this._closeMat.forEach((value, key) => {
            value.clear();
        });
        this._closeMat.get(x1).set(y1, true);
        this._EnumNode(x1, y1, x2, y2, []);
        while (this._openList.length > 0) {
            for (let i = 0; i < 2; i++) {
                let data = this._openList[0];
                if (!data) {
                    return;
                }
                let x = data.x;
                let y = data.y;
                if (x == x2 && y == y2) {
                    return data.savePath;
                }
                this._openList.shift();
                this._EnumNode(x, y, x2, y2, data.savePath);
            }
        }
    }

}