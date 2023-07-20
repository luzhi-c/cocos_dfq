import { CollsiderData } from "../../Data/ConfigData";
import { EntityComponent } from "../../ECS/Factory";
import _INPUT from "../../ECS/Service/Input";
import { AssetType, ResMgr } from "../../Mgr/ResMgr";
import { Collider } from "../Collider/Collider";
import { AIBase } from "./AIBase";

export class Judge extends AIBase {
    public collider: Collider;
    public key: string;
    public target: EntityComponent;
    public constructor(entity: EntityComponent, data: string, key?: string, Select?: Function) {
        super(entity);
        this.key = key;
        this.HandleData(data);
    }

    public HandleData(data)
    {
        let colliderData = ResMgr.GetAsset(data, AssetType.collider).json;
        this.collider = new Collider(colliderData);
    }

    public Select()
    {
        return null;
    }

    public Tick() {
        if (!this.CanRun()) {
            return;
        }

        this.AdjustCollider();
        this.target = this.Select();
        if (this.target) {
            if (this.key) {
                _INPUT.Press(this.entity.input, this.key);
            }
            return true;
        }

        return false;
    }

    public AdjustCollider() {
        let direction = this.entity.transform.direction;
        let position = this.entity.transform.position;
        let scale = this.entity.transform.scale;
        this.collider.Set(position.x, position.y, position.z, scale.x * direction, scale.y);
    }
}