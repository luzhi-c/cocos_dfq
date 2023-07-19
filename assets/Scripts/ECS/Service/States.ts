import { AspectComponent } from "../Components/AspectComponent";
import { StatesComponent } from "../Components/StatesComponent";
import { _ASPECT } from "./Aspect";

export class _STATE
{
    public static Play(states: StatesComponent, name:string, isOnly: boolean = false, ...params)
    {
        let lateState = states.current;
        let nextState = states.map.get(name);
        if (!nextState)
        {
            return false;
        }
        else if (nextState == lateState && isOnly)
        {
            return false;
        }
        if (nextState.Tick(lateState, params))
        {
            return false;
        }
        if (lateState)
        {
            if (lateState.Exit(nextState) == false)
            {
                return false;
            }
        }

        states.later = lateState;
        states.current = nextState;
        states.current.Enter(lateState, ...params);
        return true;
    }

    public static HasTag(states: StatesComponent, tag: string)
    {
        return states.current.HasTag(tag);
    }

    public static Reset(states: StatesComponent, isForce: boolean = false)
    {
        this.Play(states, "stay", isForce);
    }

    public static AutoPlayEnd(states: StatesComponent, aspect: AspectComponent, nextState: string)
    {
        if (_ASPECT.GetPart(aspect).TickEnd())
        {
            this.Play(states, nextState);
        }
    }

}