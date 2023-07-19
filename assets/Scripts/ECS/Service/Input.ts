
export enum InputState {
    none,
    pressed,
    hold,
    released
}

export default class _INPUT {

    public static Press(input, key) {
        return _LIB_INPUT.OnPressed(input.map, key);
    }

    public static Release(input, key) {
        return _LIB_INPUT.OnReleased(input.map, key);
    }

    public static IsPressed(input, key) {
        return _LIB_INPUT.IsPressed(input.map, key);
    }

    public static IsHold(input, key) {
        return _LIB_INPUT.IsHold(input.map, key);
    }

    public static GetKeyWithDirection(direction, type: string = "front") {
        if (direction > 0) {
            if (type == "back") {
                return "left";
            }
            return "right";
        }
        else {
            if (type == "back") {
                return "right";
            }
            return "left";
        }
    }

    public static GetArrowDirection(input, direction) {
        let front = _INPUT.GetKeyWithDirection(direction);
        let back = _INPUT.GetKeyWithDirection(direction, "back");

        if (_INPUT.IsHold(input, back)) {
            return -1;
        }
        else if (_INPUT.IsHold(input, front)) {
            return 1;
        }
        return 0;

    }
}

export class _LIB_INPUT {

    public static IsPressed(map, key) {
        return map.get(key) == InputState.pressed;
    }

    public static IsHold(map, key) {
        return map.get(key) == InputState.hold;
    }

    public static IsReleased(map, key) {
        return map.get(key) == InputState.released;
    }

    public static OnPressed(map, key) {
        let value = map.has(key) ? InputState.hold : InputState.pressed;
        map.set(key, value);
    }

    public static OnReleased(map, key) {
        if (map.has(key) && map.get(key) != InputState.released) {
            map.set(key, InputState.released);
            return true;
        }
        return false;
    }

    public static Update(map: Map<string, InputState>) {
        map.forEach((value, key) => {
            if (value == InputState.pressed) {
                map.set(key, InputState.hold);
            }
            else if (value == InputState.released) {
                map.delete(key);
            }
        });
    }
}