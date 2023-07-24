import { log } from "cc";
import { SystemBase } from "../ECS/SystemBase";
import { _MATH } from "../Utils/Math";

/**
 * Map可以将任意值作为key,但是object {}不可以,
 * map.has(key)取代object[],后者只能判断数据类型 会将所有数据判断成同一个
 * 
 **/

export class QuickList<T> {
    protected map: Map<T, number>;
    protected list: Array<T>;
    public constructor() {
        this.map = new Map();
        this.list = [];
    }

    private _SortSetting(list, i) {
        this.map.set(list[i], i);
    }

    public Add(obj: T, order?: number) {
        if (this.map.has(obj)) {
            this.Del(obj);
        }
        let max = this.list.length - 1;
        if (max < 0) {
            max = 0;
        }
        order = order ? order : max;
        if (order > max) {
            order = max;
        }
        //插入
        this.list.splice(order, 0, obj);
        this.Refresh(order);
    }

    public Del(obj) {
        if (this.map.has(obj)) {
            let index = this.map.get(obj);
            // 删除
            this.list.splice(index, 1);
            this.Refresh(index);
            this.map.delete(obj);
        }
    }

    public Refresh(order?: number) {
        order = order || 0;
        for (let i = order; i < this.list.length; i++) {
            this.map.set(this.list[i], i);
        }
    }

    public GetLength() {
        return this.list.length;
    }


    public Get(index) {
        return this.list[index];
    }

    public GetIndexWithValue(obj) {
        return this.map.get(obj);
    }


    public HasValue(obj) {
        return this.map.get(obj) != null;
    }

    public Sort(sortFunc) {
        // 优化快速排序
        _MATH.QuickSort(this.list, 0, this.list.length - 1, sortFunc, this._SortSetting.bind(this));
    }

    public Clear() {
        this.list = [];
        this.map.clear();
    }
}