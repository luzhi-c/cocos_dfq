import { JsonAsset, _decorator, log } from "cc";
import { FrameaniData } from "../../Data/ConfigData";
import { _ASPECT } from "../../ECS/Service/Aspect";
import { _STATE } from "../../ECS/Service/States";
import { AssetType, ResMgr } from "../../Mgr/ResMgr";
import { Tools } from "../../Utils/Tools";
import { Collider } from "../Collider/Collider";
import { EntityComponent } from "../../ECS/Factory";

type SoundSet =
    {
        voice: string[];
        swing: string[];
        hitting: string[];
    }

type ShakeParam =
    {
        xa: number;
        xb: number;
    }
type StunParam =
    {
        time?: number;
        power?: number;
        speed?: number;
        direction?: number;
    }
type FlightParam =
    {
        power_z: number;
        power_x?: number;
        direction?: number;
    }
export type AttackDataSet =
    {
        interval?: number;
        collision?: object;
        shake?: ShakeParam;
        stun?: StunParam;
        effect?: string;
        flight?: FlightParam;
    }

export class StateBase {
    // 可以切换状态机的标志
    public _tagMap: Map<string, boolean>;
    // 此状态的实体
    public entity: EntityComponent;
    public stateName: string;
    // 下一个状态
    public nextState: string;

    public frameaniSet: FrameaniData[];
    public attackDataSet: AttackDataSet[];
    public soundSet: SoundSet;
    public colliderSet: string[];
    public collides: Map<string, Collider> = new Map(); // 碰撞框

    public statePath;
    public Start(statePath: string) {
        this.statePath = statePath;
        let stateData = ResMgr.GetAsset(statePath, AssetType.state) as JsonAsset;
        let data: any = stateData.json;
        this.HandleData(data);
    }

    public HandleData(data) {
        this.stateName = data.name;
        this._tagMap = Tools.ObjectToMap(data.tagMap);
        this.frameaniSet = []
        for (let i = 0; i < data.frameaniPath.length; i++) {
            let frameani = ResMgr.GetAsset(data.frameaniPath[i], AssetType.frameani) as JsonAsset;
            this.frameaniSet.push(frameani.json as FrameaniData);
        }
        this.nextState = data.nextState;

        this.soundSet = data.sound;
        this.attackDataSet = data.attack;
        this.colliderSet = data.collider;

        // if (data.actor) {
        //     for (let i = 0; i < data.actor.length; i++) {
        //         if (data.actor[i].effect) {
        //             total += 1;
        //             this.PreLoadInstanceData(state.actor[i], complete);
        //         }
        //     }
        // }
    }

    public Init(entity: EntityComponent) {
        this.entity = entity;
    }

    public Enter(...params) {
        //  自动开始播放
        if (this.HasTag("autoPlay")) {
            let data = this.frameaniSet[0];
            _ASPECT.Play(this.entity.aspect, data);
        }
    }

    public Update(dt: number, rate: number) {
        let identity;

        this.NormalUpdate(dt, rate);
    }

    public NormalUpdate(dt: number, rate: number) {
        // 自动结束切换下一个状态
        if (this.HasTag("autoEnd")) {
            _STATE.AutoPlayEnd(this.entity.states, this.entity.aspect, this.nextState);
        }
    }

    public Tick(...param) {
        return false;
    }

    public Exit(nextState: StateBase): boolean {
        return true;
    }

    public HasTag(tag: string) {
        return this._tagMap.has(tag);
    }

    public GetName() {
        return this.stateName;
    }
}