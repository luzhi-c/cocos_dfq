import { log, math } from "cc";

export class _MATH {
    public static randomSeed: number = 233280;
    public static SetRandomSeed(seed) {
        this.randomSeed = seed;
    }

    public static Random() {
        this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
        return this.randomSeed / 233280;
    }

    // max自增1 这样就包含自己了
    public static RangeInt(min: number, max: number) {
        if (max <= min) {
            return min;
        }
        max = max + 1;
        let random = this.Random();
        return min + Math.floor((max - min) * random);
    }

    public static Range(min: number, max: number) {
        let random = this.Random();
        return min + (max - min) * random;
    }

    public static GetDirection(value) {
        return value >= 0 ? 1 : -1;
    }

    public static Clamp(value, min, max) {
        return value < min ? min : (value > max ? max : value);
    }


    public static GetFixedDecimal(decimal) {
        return Math.floor(Math.abs(decimal * 1000)) * 0.001 * _MATH.GetDirection(decimal)
    }
    // 快速排序
    public static QuickSort(list: Array<any>, left: number, right: number, Compare: Function, Set: Function) {
        if (left >= right) {
            return;
        }
        let i = left;
        let j = right;
        let temp = list[i];
        while (i < j) {
            while (!Compare(list[j], temp) && i < j) {
                j--;
            }
            if (i < j) {
                list[i] = list[j];
                Set(list, i);
                i++;
            }

            while (Compare(list[i], temp) && i < j) {
                i++;
            }
            if (i < j) {
                list[j] = list[i];
                Set(list, j);
                j--;
            }

        }
        list[i] = temp;
        Set(list, i);
        this.QuickSort(list, left, i - 1, Compare, Set);
        this.QuickSort(list, i + 1, right, Compare, Set);
    }

    public static RotatePoint(px, py, ox, oy, radian) {
        let x = (px - ox);
        let y = (py - oy);
        let cos = Math.cos(radian);
        let sin = Math.sin(radian);
        let data: any = {};
        data.x = x * cos - y * sin + ox;
        data.y = x * sin + y * cos + oy;
        return data;
    }
}