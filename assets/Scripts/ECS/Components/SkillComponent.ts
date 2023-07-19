import { _decorator, Component, log, Node } from 'cc';
import { ComponentBase } from '../ComponentBase';
import { FrameAni } from '../../Render/FrameAni';
import { Layer } from '../Node/Layer';
import { AspectData } from '../../Data/ConfigData';
import { Container } from '../../Base/Container';
import { SkillBase } from '../../Game/Skill/SkillBase';
import { Caller } from '../../Base/Caller';

// 技能
export class SkillsComponent extends ComponentBase {
    public container: Container<SkillBase>;
    public caller: Caller;
    public data;
    public Init(data): void {
        this.data = data;
        this.container = new Container();
        this.caller = new Caller();
    }
}