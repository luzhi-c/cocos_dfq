import { AudioClip, AudioSource, Node, log } from "cc";
import { AssetType, ResMgr } from "./ResMgr";

export class SoundManager {
    public _queueMap: Map<string, Array<AudioSource>> = new Map();
    public _cachedSoundList: Map<string, AudioSource[]> = new Map();
    public _playingSoundList: Map<string, AudioSource[]> = new Map();
    public _playingListByGroup: Map<number, AudioSource[]> = new Map();

    public PlaySound(sound: string, group?: number) {
        group = group || 0;
        if (!this._queueMap.has(sound)) {
            this._queueMap.set(sound, []);
        }
        if (!this._playingSoundList.has(sound)) {
            this._playingSoundList.set(sound, []);
        }
        if (this._queueMap.get(sound).length < 2) {
            if (!this._playingListByGroup.has(group)) {
                this._playingListByGroup.set(group, []);
            }
            let audioSource;
            if (this._cachedSoundList.has(sound)) {
                if (this._cachedSoundList.get(sound).length > 0) {
                    audioSource = this._cachedSoundList.get(sound).pop();
                    // log("复用声音", sound);
                }
            }
            if (!audioSource) {
                let node = new Node();
                audioSource = node.addComponent(AudioSource);
                let clip = ResMgr.GetAsset(sound, AssetType.audio);
                audioSource.clip = clip;
            }
            this._queueMap.get(sound).push(audioSource);
            this._playingSoundList.get(sound).push(audioSource);
            this._playingListByGroup.get(group).push(audioSource);
            // audioSource.play();
        }


    }

    public CachedSound(key, audioSource) {
        if (!this._cachedSoundList.has(key)) {
            this._cachedSoundList.set(key, []);
        }

        this._cachedSoundList.get(key).push(audioSource);
    }

    public Update() {
        let hasSound = false;
        this._queueMap.forEach(list => {
            hasSound = true;
            for (let i = 0; i < list.length; i++) {
                list[i].play();
            }
        });
        this._playingSoundList.forEach((list, key) => {
            for (let i = list.length - 1; i >= 0; i--) {
                if (!list[i].playing) {
                    this.CachedSound(key, list[i]);
                    list.splice(i, 1);
                }
            }
        });
        this._playingListByGroup.forEach((list, key) => {
            for (let i = list.length - 1; i >= 0; i--) {
                if (!list[i].playing) {
                    list.splice(i, 1);
                }
            }
        });
        if (hasSound) {
            this._queueMap.clear();
        }
    }
}

export let SoundMgr = new SoundManager();
window["SoundMgr"] = SoundMgr;