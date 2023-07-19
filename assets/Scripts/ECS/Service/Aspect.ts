import { FrameaniData } from "../../Data/ConfigData";
import { Collider } from "../../Game/Collider/Collider";
import { AspectComponent } from "../Components/AspectComponent";

export class _ASPECT {
    public static GetPart(aspect: AspectComponent, name: string = "body") {
        name = name || "body";
        return aspect.layer.Get(name);
    }

    public static GetBodySolidRectList(aspect: AspectComponent, colliderKey?: string) {
        let collider = _ASPECT.GetPart(aspect).GetCollider();

        if (collider) {
            return collider.GetList(colliderKey)
        }
        return null;
    }

    public static Play(aspect, frameaniData: FrameaniData, isOnly?: boolean) {
        let part = this.GetPart(aspect);
        part.Play(frameaniData, isOnly);
    }

    public static ClearCollider(aspect: AspectComponent) {
        aspect.layer.GetMap().forEach((value) => {
            value.SetCollider(null);
        });
    }
}