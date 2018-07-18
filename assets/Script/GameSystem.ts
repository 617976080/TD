import GameBase from "./Game/GameBase";

export default abstract class GameSystem{
    protected gameBase : GameBase;
    constructor(gameBase : GameBase) {
        this.gameBase = gameBase;
    }
    public update(dt : number) : void{

    }
}