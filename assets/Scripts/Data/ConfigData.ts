import { SpriteFrame, Vec2 } from "cc";

export type FramaniDataOne = {
    time: number;
    sprite: string;
}

export type CollsiderData =
    {
        damage: Array<CollsiderStruct>;
        attack: Array<CollsiderStruct>;
    }

type CollsiderStruct =
    {
        x: number;
        y1: number;
        z: number;
        w: number;
        y2: number;
        h: number;
    }

export type FrameaniData =
    {
        list: FramaniDataOne[];
        colliderPath: string;
    };

export class AspectPart {
    public frameaniPath: string;
    public spritePath: string;
    public avatar: string; // 记录部位层级等数据的配置路径
    public type: string; // 类型 动画 图片 或文字 预制体等
    public parts: Array<string>; //部位组合
    public name: string; // 标识
    public height: number;
}

export type AspectData = Array<AspectPart>;

export class SpriteData {
    public sprite: SpriteFrame;
    public ox: number;
    public oy: number;
    public width: number;
    public height: number;
}