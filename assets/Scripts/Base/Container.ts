type Transfer =
    {
        list: Array<any>;
        map: Map<string, number>;
    }

export class Container<T> {
    public _list: Array<T> = [];
    public _map: Map<string, T>;
    public _transfer: Transfer;

    public constructor() {
        this._list = [];
        this._map = new Map();

        this._transfer = {
            list: [],
            map: new Map()
        }
    }

    public Add(obj: T, tag?: string, order?: number) {
        if (tag && this._map.has(tag)) {

        }

        let max = this._list.length;
        order = order || max;
        if (order > max) {
            order = max;
        }
        this._list.splice(order, 0, obj);

        if (tag) {
            this._transfer.list.splice(order, 0, obj);
            this._map.set(tag, obj);
        }

        this._RefreshTransfer(order);
    }

    private _RefreshTransfer(start?: number) {
        start = start || 0;
        for (let i = start; i < this._transfer.list.length; i++) {
            this._transfer.map.set(this._transfer.list[i], i);
        }
    }

    private _Remove(tag?: string, order?: number) {
        this._list.splice(order, 1);
        this._transfer.list.splice(order, 1);
        if (tag) {
            this._map.delete(tag);
            this._transfer.map.delete(tag);
        }
        this._RefreshTransfer(order);
    }

    public Del(tag?: string) {
        let order = this._transfer.map.get(tag);
        if (order) {
            this._Remove(tag, order);
        }
    }

    public DelWithIndex(index: number) {
        let tag = this._transfer.list[index];
        if (tag) {
            this._Remove(tag, index);
        }
    }

    public Get(tag: string) {
        return this._map.get(tag);
    }

    public GetWithIndex(index: number) {
        return this._list[index];
    }

    public GetLength() {
        return this._list.length;
    }

    public Sort(Func: Function) {
        for (let n = 0; n < this._list.length - 1; n++) {
            for (let m = 0; m < this._list.length - n; m++) {
                if (!Func(this._list[m], this._list[n])) {
                    let tmp = this._list[m];
                    this._list[m] = this._list[m + 1];
                    this._list[m + 1] = tmp;

                    if (this._transfer.list[m] && this._transfer.list[m + 1]) {
                        tmp = this._transfer.list[m];
                        this._transfer.list[m] = this._transfer.list[m + 1];
                        this._transfer.list[m + 1] = tmp;

                        let tempobj = this._transfer.map.get(this._transfer.list[m]);
                        this._transfer.map.set(this._transfer.list[m], this._transfer.map.get(this._transfer.list[m + 1]));
                        this._transfer.map.set(this._transfer.list[m + 1], tempobj);
                    }
                }
            }
        }
    }

    public DelAll() {
        this._list = [];
        this._map.clear();

        this._transfer.list = [];
        this._transfer.map.clear();
    }

}