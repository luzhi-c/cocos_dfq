import { Asset, error, resources, Node, SpriteFrame, JsonAsset, Sprite, RenderTexture, AudioClip, log } from "cc";
import { AspectData, FrameaniData, SpriteData } from "../Data/ConfigData";

export enum AssetType {
    instance,
    aspect,
    frameani,
    state,
    sprite,
    map,
    audio,
    music,
    collider,
    skills,

}
export class ResourceManager {
    private spriteCache = new Map();
    private mapCache = new Map();
    private instanceCache = new Map();
    private frameaniCache = new Map();
    private aspectCache = new Map();
    private stateCache = new Map();
    private audioCache = new Map();
    private musicCache = new Map();
    private colliderCache = new Map();
    private skillsCache = new Map();

    public LoadAsset(path, type, cb: Function) {
        resources.load(path, type, (err, asset) => {
            if (err) {
                cb(null);
                return;
            }
            cb(asset);
        });

    }

    public GetAsset(path, type: AssetType) {
        if (type == AssetType.instance) {
            return this.instanceCache.get(path);
        }
        else if (type == AssetType.aspect) {
            return this.aspectCache.get(path);
        }
        else if (type == AssetType.frameani) {
            return this.frameaniCache.get(path);
        }
        else if (type == AssetType.state) {
            return this.stateCache.get(path);
        }
        else if (type == AssetType.sprite) {
            return this.spriteCache.get(path);
        } else if (type == AssetType.map) {
            return this.mapCache.get(path);
        }
        else if (type == AssetType.skills) {
            return this.skillsCache.get(path);
        }
        else if (type == AssetType.audio) {
            return this.audioCache.get(path);
        } else if (type == AssetType.music) {
            return this.musicCache.get(path);
        }
        else if (type == AssetType.collider) {
            return this.colliderCache.get(path);
        }
    }

    public async LoadAssetAsync(path, type): Promise<Asset> {
        return new Promise((resolve, reject) => {
            resources.load(path, type, (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(asset);
            });
        })
    }

    public GetFrameaniSpriteBasePath(path) {
        return `actor/${path}`;
    }

    public GetMapPath(path) {
        return `config/map/${path}`;
    }

    public GetInstancePath(path) {
        return `config/instance/${path}`;
    }

    public GetAvatarPath(path) {
        return `config/avatar/${path}`;
    }

    public GetFrameAniPath(path) {
        return `config/frameani/${path}`;
    }

    public GetStatePath(path) {
        return `config/state/${path}`;
    }

    public GetMusicPath(path) {
        return `music/${path}`;
    }

    public GetAudioPath(path) {
        return `sound/${path}`;
    }

    public GetColliderPath(path) {
        return `config/collider/${path}`;
    }

    public GetSkillsPath(path) {
        return `config/skill/duelist/${path}`;
    }

    public CacheSpriteData(path, sprite, spriteoffset) {
        let spriteData = new SpriteData();
        if (spriteoffset) {
            let json: any = (spriteoffset as JsonAsset).json;
            spriteData.ox = json.ox;
            spriteData.oy = json.oy;
        }
        else {
            spriteData.ox = 0;
            spriteData.oy = 0;
        }
        spriteData.sprite = sprite;
        spriteData.width = sprite.width;
        spriteData.height = sprite.height;
        this.spriteCache.set(path, spriteData);
        return spriteData;
    }

    public LoadSpriteData(path, cb) {
        if (this.spriteCache.has(path)) {
            cb(this.spriteCache.get(path));
            return;
        }
        let sprite;
        let spriteoffset;
        let count = 0;
        let complete = () => {
            count++;
            if (count < 2) {
                return;
            }
            this.CacheSpriteData(path, sprite, spriteoffset);
            cb(this.spriteCache.get(path));
        }
        this.LoadAsset("image/" + path + "/spriteFrame", SpriteFrame, (asset) => {
            sprite = asset;
            complete()
        });
        this.LoadAsset("config/image/" + path, JsonAsset, (asset) => {
            spriteoffset = asset;
            complete()
        });
    }

    public async GetSpriteData(path) {
        if (this.spriteCache.has(path)) {
            return this.spriteCache.get(path);
        }
        let sprite = await this.LoadAssetAsync("image/" + path + "/spriteFrame", SpriteFrame) as SpriteFrame;
        let spriteoffset = await this.LoadAssetAsync("config/image/" + path, JsonAsset);
        let spriteData = this.CacheSpriteData(path, sprite, spriteoffset);

        return spriteData;
    }
    // 混合多部位动画
    public MixPartsFrameAni() {

    }

    public async GetFrameAniData(path) {
        if (this.frameaniCache.has(path)) {
            return this.frameaniCache.get(path);
        }
        let frameani = await this.LoadAssetAsync(this.GetFrameAniPath(path), JsonAsset) as JsonAsset;
        this.frameaniCache.set(path, frameani);
        return frameani;
    }

    public async GetAspectData(path) {
        if (this.aspectCache.has(path)) {
            return this.aspectCache.get(path);
        }
        let avatar = await this.LoadAssetAsync(this.GetAvatarPath(path), JsonAsset) as JsonAsset;
        this.aspectCache.set(path, avatar);
        return avatar;
    }

    public async GetStateData(path) {
        if (this.stateCache.has(path)) {
            return this.stateCache.get(path);
        }
        let state = await this.LoadAssetAsync(this.GetStatePath(path), JsonAsset) as JsonAsset;
        this.stateCache.set(path, state);
        return state;
    }

    public PreLoad(path, cb, progress?) {
        let total = 0;
        let count = 0;
        let complete = () => {
            count += 1;
            progress && progress(count, total);
            if (count >= total) {
                this.PreLoadFrameani(path, cb);
            }
        };
        let loadStateComplete = (stateAsset) => {
            count += 1;
            let stateCfg = stateAsset.json;
            for (let i = 0; i < stateCfg.frameaniPath.length; i++) {
                total += 1;
                this.PreLoadFrameAniData(stateCfg.frameaniPath[i], complete);
            }
        }

        let loadSkillComplete = (skillAsset) => {
            count += 1;
            let skillCfg = skillAsset.json;
            total += 1;
            this.PreLoadStateData(skillCfg.stateData, complete);
        }

        this.PreLoadInstanceData(path, (instanceAsset) => {
            let instanceCfg = instanceAsset.json;
            for (let key in instanceCfg) {
                let value = instanceCfg[key];
                if (key == "states") {
                    for (let state in value) {
                        total += 1;
                        this.PreLoadStateData(value[state], loadStateComplete);
                    }
                }
                else if (key == "aspect") {
                    for (let i = 0; i < value.length; i++) {
                        if (value[i].type == "frameani") {
                            total += 1;
                            if (value[i].avatar) {
                                this.PreLoadAspectData(value[i].avatar, complete);
                            }
                            else {
                                this.PreLoadFrameAniData(value[i].path, complete);
                            }
                        }
                        total += 1;
                        this.PreLoadAspectData(value[i].avatar, complete);
                    }
                }
                else if (key == "skills") {
                    for (let skillName in value) {
                        total += 1;
                        this.PreLoadSkillsData(value[skillName], loadSkillComplete);
                    }
                }
            }
        });
    }

    public PreLoadMapData(path, cb) {
        if (this.mapCache.has(path)) {
            cb && cb(this.mapCache.get(path));
            return;
        }
        this.LoadAsset(this.GetMapPath(path), JsonAsset, (instance) => {
            this.mapCache.set(path, instance);
            cb && cb(this.mapCache.get(path));
        }
        );
    }

    public PreLoadInstanceData(path, cb) {
        if (this.instanceCache.has(path)) {
            cb && cb(this.instanceCache.get(path));
            return;
        }
        this.LoadAsset(this.GetInstancePath(path), JsonAsset, (instance) => {
            this.instanceCache.set(path, instance);
            cb && cb(this.instanceCache.get(path));
        }
        );
    }

    public PreLoadAspectData(path, cb) {
        if (this.aspectCache.has(path)) {
            cb && cb(this.aspectCache.get(path));
            return;
        }
        this.LoadAsset(this.GetAvatarPath(path), JsonAsset, (aspect) => {
            this.aspectCache.set(path, aspect);
            cb && cb(this.aspectCache.get(path));
        }
        );
    }

    public PreLoadFrameani(path, cb) {

        let total = 0;
        let count = 0;
        let complete = () => {
            count += 1;
            log(total, count)
            if (count >= total) {
                cb && cb();
            }
        };
        let instance = this.GetAsset(path, AssetType.instance).json;
        if (instance.aspect && instance.states) {
            let aspect = instance.aspect;
            let states = instance.states;
            for (let n = 0; n < aspect.length; n++) {
                if (aspect[n].avatar) {
                    for (let key in states) {
                        let state = this.GetAsset(states[key], AssetType.state).json;
                        for (let m = 0; m < state.frameaniPath.length; m++) {
                            let frameani = this.GetAsset(state.frameaniPath[m], AssetType.frameani).json;
                            for (let i = 0; i < frameani.list.length; i++) {
                                if (aspect[n].parts) {
                                    let keys = Object.keys(aspect[n].parts);
                                    for (let j = 0; j < keys.length; j++) {
                                        let spritepath = aspect[n].path + "/" + aspect[n].parts[keys[j]] + "/" + frameani.list[i].sprite;
                                        total += 1;
                                        this.LoadSpriteData(this.GetFrameaniSpriteBasePath(spritepath), complete);
                                    }
                                }
                                else {
                                    for (let j = 0; j < aspect[n].parts.length; j++) {
                                        let spritepath = aspect[n].path + "/" + frameani.list[i].sprite;
                                        total += 1;
                                        this.LoadSpriteData(this.GetFrameaniSpriteBasePath(spritepath), complete);
                                    }
                                }
                                for (let m = 0; m < frameani.colliderPath.length; m++) {
                                    total += 1;
                                    this.PreLoadColliderData(frameani.colliderPath[m] + "/" + frameani.list[i].sprite, complete);
                                }

                            }
                        }
                    }
                }
            }

        } else if (instance.aspect) {
            let aspect = instance.aspect;
            for (let n = 0; n < aspect.length; n++) {
                let frameani = this.GetAsset(aspect[n].path, AssetType.frameani).json;
                for (let i = 0; i < frameani.list.length; i++) {
                    if (aspect[n].parts) {
                        let keys = Object.keys(aspect[n].parts);
                        for (let j = 0; j < keys.length; j++) {
                            let spritepath = aspect[n].path + "/" + aspect[n].parts[keys[j]] + "/" + frameani.list[i].sprite;
                            total += 1;
                            this.LoadSpriteData(this.GetFrameaniSpriteBasePath(spritepath), complete);
                        }
                    }
                    else {
                        total += 1;
                        let spritepath = aspect[n].path + "/" + frameani.list[i].sprite;
                        this.LoadSpriteData(this.GetFrameaniSpriteBasePath(spritepath), complete);
                    }
                    if (frameani.colliderPath) {
                        for (let m = 0; m < frameani.colliderPath.length; m++) {
                            total += 1;
                            this.PreLoadColliderData(frameani.colliderPath[m] + "/" + frameani.list[i].sprite, complete);
                        }
                    }
                }
            }
        }
        if (total <= 0) {
            cb && cb();
        }
    }

    public PreLoadFrameAniData(path, cb) {
        if (this.frameaniCache.has(path)) {
            cb && cb(this.frameaniCache.get(path));
            return;
        }
        this.LoadAsset(this.GetFrameAniPath(path), JsonAsset, (frameani) => {
            this.frameaniCache.set(path, frameani);
            cb && cb(this.frameaniCache.get(path));
        }
        );
    }

    // state内的数据
    public PreLoadStateDataByState(state, cb) {
        let total = 0;
        let count = 0;
        let complete = () => {
            count += 1;
            if (count >= total) {
                cb && cb();
            }
        };
        if (state.sound) {
            for (let key in state.sound) {
                let list = state.sound[key];
                for (let i = 0; i < list.length; i++) {
                    total += 1;
                    this.PreLoadAudioData(list[i], complete);
                }
            }
        }
        if (state.attack) {
            for (let i = 0; i < state.attack.length; i++) {
                if (state.attack[i].effect) {
                    total += 1;
                    this.PreLoad(state.attack[i].effect, complete);
                }
            }
        }

        if (state.actor) {
            for (let i = 0; i < state.actor.length; i++) {
                total += 1;
                this.PreLoadInstanceData(state.actor[i], complete);
            }
        }

        if (state.collider) {
            for (let i = 0; i < state.collider.length; i++) {
                total += 1;
                this.PreLoadColliderData(state.collider[i], complete);
            }
        }
        if (total <= 0) {
            cb && cb();
        }
    }

    public PreLoadStateData(path, cb) {
        if (this.stateCache.has(path)) {
            cb && cb(this.stateCache.get(path));
            return;
        }
        this.LoadAsset(this.GetStatePath(path), JsonAsset, (state) => {
            this.stateCache.set(path, state);
            this.PreLoadStateDataByState(state.json, () => {
                cb && cb(state);
            });
        }
        );
    }


    public PreLoadMap(path, cb, progress?) {
        let total = 0;
        let count = 0;
        let complete = () => {
            count += 1;
            progress && progress(count, total);
            if (count >= total) {
                cb && cb();
            }
        };

        this.PreLoadMapData(path, (mapAsset) => {
            let config = mapAsset.json;
            if (config.info) {
                if (config.info.bgs) {
                    total += 1;
                    this.PreLoadAudioData(config.info.bgs, complete);
                }
                if (config.info.bgm) {
                    total += 1;
                    this.PreLoadMusicData(config.info.bgm, complete);
                }
            }
            if (config.far) {
                total += 1;
                this.LoadSpriteData(config.far, complete);
            }
            if (config.near) {
                total += 1;
                this.LoadSpriteData(config.near, complete);
            }
            if (config.floor) {
                if (config.floor.top) {
                    total += 1;
                    this.LoadSpriteData(config.floor.top, complete);
                }
                if (config.floor.extra) {
                    total += 1;
                    this.LoadSpriteData(config.floor.extra, complete);
                }
            }
        });
    }

    public PreLoadMusicData(path, cb) {
        if (this.musicCache.has(path)) {
            cb && cb(this.musicCache.get(path));
            return;
        }
        this.LoadAsset(this.GetMusicPath(path), AudioClip, (audio) => {
            this.musicCache.set(path, audio);
            cb && cb(this.musicCache.get(path));
        }
        );
    }

    public PreLoadAudioData(path, cb) {
        if (this.audioCache.has(path)) {
            cb && cb(this.audioCache.get(path));
            return;
        }
        this.LoadAsset(this.GetAudioPath(path), AudioClip, (audio) => {
            this.audioCache.set(path, audio);
            cb && cb(this.audioCache.get(path));
        }
        );
    }

    public PreLoadColliderData(path, cb) {
        if (this.colliderCache.has(path)) {
            cb && cb(this.colliderCache.get(path));
            return;
        }
        this.LoadAsset(this.GetColliderPath(path), JsonAsset, (audio) => {
            this.colliderCache.set(path, audio);
            cb && cb(this.colliderCache.get(path));
        }
        );
    }

    // 预加载技能相关配置
    public PreLoadSkillsData(path, cb) {
        if (this.skillsCache.has(path)) {
            cb && cb(this.skillsCache.get(path));
            return;
        }
        this.LoadAsset(this.GetSkillsPath(path), JsonAsset, (asset) => {
            this.skillsCache.set(path, asset);
            cb && cb(this.skillsCache.get(path));
        }
        );
    }
}

export let ResMgr = new ResourceManager();
window["ResMgr"] = ResMgr;