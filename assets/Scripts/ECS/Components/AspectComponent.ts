import { _decorator, Component, log, Node } from 'cc';
import { ComponentBase } from '../ComponentBase';
import { FrameAni } from '../../Render/FrameAni';
import { Layer } from '../Node/Layer';
import { AspectData } from '../../Data/ConfigData';

// 人物表现层 帧动画 人物头顶名字 称号等
export class AspectComponent extends ComponentBase {
    public isPause: boolean = false;
    public rate: number = 1;
    public avatar;
    public layer: Layer;

    public Init(data: AspectData): void {
        this.avatar = data;
        this.layer = this.addComponent(Layer);
        this.layer.Init(this);
        for (let i = 0; i < data.length; i++) {
            this.layer.Add(data[i]);
        }
    }


}