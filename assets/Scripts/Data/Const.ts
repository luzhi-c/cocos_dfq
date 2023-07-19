import { KeyCode } from "cc";
import User from "./User";
import { Point } from "../Game/Map/Bstar";

export default class Const {
    public static user: User;

    public static arrow = ["up", "down", "left", "right"];
    public static designSize = new Point(1136, 640);
    public static screenSize = new Point();

    public static debug = {
        collider: false,
    }

    public static code: Map<KeyCode, string> = new Map();
    public static Init() {

        this.user = new User();

        this.code.set(KeyCode.ARROW_UP, "up");
        this.code.set(KeyCode.ARROW_DOWN, "down");
        this.code.set(KeyCode.ARROW_LEFT, "left");
        this.code.set(KeyCode.ARROW_RIGHT, "right");
        this.code.set(KeyCode.KEY_X, "normalAttack");
    }

    public static SetScreenSize(width, height) {
        this.screenSize.Set(width, height);
    }


}