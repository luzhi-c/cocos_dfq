import { Graphics } from "cc";
import { CollsiderData } from "../../Data/ConfigData";
import { CollideResult, SolidRect } from "../Map/SolidRect";

export class Collider {
    private _listMap: Map<string, SolidRect[]>;
    public constructor(colliderData: CollsiderData) {
        this._listMap = new Map();
        let keys = Object.keys(colliderData);
        for (let i = 0; i < keys.length; i++) {
            this._listMap.set(keys[i], []);
            for (let n = 0; n < colliderData[keys[i]].length; n++) {
                let v = colliderData[keys[i]][n];
                let solidRect = new SolidRect(v.x, v.y1, v.y2, v.z, v.w, v.h);
                this._listMap.get(keys[i]).push(solidRect);
            }
        }
    }

    public Set(px: number, py: number, pz?: number, sx?: number, sy?: number, r?: number) {
        this._listMap.forEach((list, key) => {
            for (let i = 0; i < list.length; i++) {
                list[i].Set(px, py, pz, sx, sy, r);
            }
        });
    }

    public GetList(key?: string) {
        key = key || "damage";
        return this._listMap.get(key);
    }

    public Collide(opponent: Collider, selfKey: string, oppKey: string): CollideResult {
        if (!opponent) {
            return;
        }
        let a = this.GetList(selfKey);
        let b = opponent.GetList(oppKey);
        if (!a || !b) {
            return;
        }

        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                let result = a[i].Collide(b[j]);
                if (result.isDone) {
                    return result;
                }
            }
        }
        let result: any = {};
        result.isDone = false;
        return result;
    }

    public CheckPoint(x: number, y, z?, key?: string): boolean {
        let list = this.GetList(key);
        for (let i = 0; i < list.length; i++) {
            if (list[i].CheckPoint(x, y, z)) {
                return true;
            }
        }
        return false;
    }

    public Draw() {
        this._listMap.forEach((list) => {
            for (let i = 0; i < list.length; i++) {
                list[i].Draw();
            }
        });
    }
}