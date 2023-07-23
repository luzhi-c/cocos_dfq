import { _decorator, Component, director, Label, Node, Scene } from 'cc';
import { ResMgr } from './Mgr/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Label)
    public progressLable: Label;
    start() {
        this.progressLable.string = "开始加载地图...";
        ResMgr.PreLoadMap("lorien", () => {
            this.progressLable.string = "加载地图已完成...准备加载资源";

            ResMgr.PreLoad("duelist/swordman",
                () => {
                    director.loadScene("main", () => {
                        
                    })
                },
                (count, total) => {
                    this.progressLable.string = "正在加载资源..." + Math.floor(count * 100 / total) + "%";
                })

        },
            (count, total) => {
                this.progressLable.string = "正在加载地图..." + Math.floor(count * 100 / total) + "%";
            }
        );
    }

    update(deltaTime: number) {

    }
}

