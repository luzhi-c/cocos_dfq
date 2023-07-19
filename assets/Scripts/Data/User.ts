import { Caller } from "../Base/Caller";
import { EntityComponent } from "../ECS/Components/EntityComponent";

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

        this.setPlayerCaller.Call(this.player, player);
        this.player = player;
    }
}