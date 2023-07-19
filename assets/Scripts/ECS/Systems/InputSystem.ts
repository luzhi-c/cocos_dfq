import { input, Input, KeyCode } from "cc";
import { EcsMgr } from "../EcsMgr";
import { SystemBase } from "../SystemBase";
import { World } from "../World";
import InputComponent from "../Components/InputComponent";
import Const from "../../Data/Const";
import _INPUT, { _LIB_INPUT } from "../Service/Input";

export default class InputSystem extends SystemBase
{
    public OnPressed(key: KeyCode)
    {
        let player = Const.user.player;
        if (player)
        {
            let code = Const.code.get(key);
            if (code)
            {
                _INPUT.Press(player.input, code);
            }
        }
    }

    public OnReleased(key: KeyCode)
    {
        let player = Const.user.player;
        if (player)
        {
            let code = Const.code.get(key);
            if (code)
            {
                _INPUT.Release(player.input, code);
            }
        }
    }

    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("input", true);
        super.Start(world, ecsmgr, map,
            "input"
        );

        input.on(Input.EventType.KEY_DOWN, (event) => {
            this.OnPressed(event.keyCode);
        });

        input.on(Input.EventType.KEY_UP, (event) => {
            this.OnReleased(event.keyCode);
        });
    }

    public LateUpdate(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e = this._list.Get(i);
            let input: InputComponent = e.input;
            _LIB_INPUT.Update(input.map)
        }
    }
}