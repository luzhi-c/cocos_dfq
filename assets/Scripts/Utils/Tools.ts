import { SpriteData } from "../Data/ConfigData";

export class Tools {
    public static GetStr(str: string, rep: string) {
        return str.replace("$A", rep);
    }

    public static ObjectToMap(object) {
        let map = new Map();
        for (let key in object) {
            map.set(key, object[key]);
        }
        return map;
    }

    public static GetTruePosition(spriteData: SpriteData, x, y) {
        let offset: any = {};
        offset.x = x + spriteData.width / 2 - spriteData.ox;
        offset.y = -(y + spriteData.oy + spriteData.height / 2);
        return offset;
    }

    // 转换为图片锚点在左上角，世界坐标系为y轴向下时的坐标
    public static GetImagePosition(ox, oy, width, height) {
        let offset: any = {};
        offset.x = width / 2 - ox;
        offset.y = oy - height / 2;
        return offset;
    }
}