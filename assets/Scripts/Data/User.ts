import { Caller } from "../Base/Caller";
import { EntityComponent } from "../ECS/Factory";

export default class User
{
    private setPlayerCaller: Caller;
    public player: EntityComponent;
    public constructor()
    {
        this.setPlayerCaller = new Caller();
    }

    public SetPlayer(player: EntityComponent)
    {
        if(this.player == player)
        {
            return;
        }

        player.ais.enable = false;

        this.setPlayerCaller.Call(this.player, player);
        this.player = player;
    }
}