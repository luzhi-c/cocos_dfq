type CallerType =
    {
        obj: any;
        func: Function;
    }

export class Caller {
    private _listenerList: Array<CallerType>;
    public constructor() {
        this._listenerList = [];
    }

    public AddListener(obj: any, func: Function) {
        this._listenerList.push({ obj, func })
    }

    public RemoveListener(obj: any, func: Function) {
        for (let i = this._listenerList.length - 1; i >= 0; i--) {
            if (this._listenerList[i].obj == obj && this._listenerList[i].func == func) {
                this._listenerList.splice(i, 1);
            }
        }
    }
    // 调用
    public Call(...params) {
        for (let i = this._listenerList.length - 1; i >= 0; i--) {
            this._listenerList[i].func.call(this._listenerList[i].func, this._listenerList[i].obj, ...params);
        }
    }
}