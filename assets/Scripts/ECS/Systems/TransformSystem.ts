import { _decorator, Component, log, Node, Vec3 } from 'cc';
import { SystemBase } from '../SystemBase';
import { EcsMgr } from '../EcsMgr';
import { World } from '../World';
import { TransformComponent } from '../Components/TransformComponent';
import { AspectComponent } from '../Components/AspectComponent';
import { EntityComponent } from '../Factory';
const { ccclass, property } = _decorator;

@ccclass('TransformSystem')
export class TransformSystem extends SystemBase {
    public Start(world: World, ecsmgr: EcsMgr): void {
        let map = new Map();
        map.set("transform", true);
        map.set("aspect", true);
        super.Start(world, ecsmgr, map,
            "transfrom"
        );
    }

    public Sorting(a: EntityComponent, b: EntityComponent) {
        let transformA = a.transform;
        let transformB = b.transform;
        if (transformA.position.y == transformB.position.y)
        {
            return a.identity.id - b.identity.id;
        }
        return transformA.position.y - transformB.position.y;
    }

    public OnInit(entity: EntityComponent) {
        entity.transform.Enter(entity);
        entity.aspect.Enter(entity);
    }

    public Update(dt: number, rate: number): void {
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e: EntityComponent = this._list.Get(i);
            let aspect: AspectComponent = e.aspect;
            // if (!e.identity.isPause && !aspect.isPause) {
            //     aspect.layer.Update(dt);
            // }
            if (!aspect.isPause) {
                aspect.layer.Update(dt);
            }
        }
    }

    public LateUpdate(dt: number, rate: number): void {
        let changed = false;
        for (let i = 0; i < this._list.GetLength(); i++) {
            let e: EntityComponent = this._list.Get(i);
            let transform: TransformComponent = e.transform;
            let colliderTick = transform.positionTick || transform.scaleTick || transform.radianTick;
            if (transform.positionTick) {
                let x = transform.position.x + transform.shake.x + transform.shift.x;
                let y = transform.position.y + transform.position.z + transform.shake.y + transform.shift.y;
                e.identity.node.setPosition(x, -y);
                transform.positionTick = false;
                changed = true;
            }
            if (transform.scaleTick) {
                e.identity.node.setScale(transform.scale.x * transform.direction, transform.scale.y);
                transform.scaleTick = false;
            }
        }

        if (changed)
        {
            this._list.Sort(this.Sorting.bind(this));
            for (let i = 0; i < this._list.GetLength(); i++) {
                let e: EntityComponent = this._list.Get(i);
                e.identity.node.setSiblingIndex(i);
            }
        }
    }
}