export enum GameState{
    PREPARE_STATE,
    GAME_START,
    GAME_OVER
}
export default abstract class GameBaseState{
    protected nextState : GameBaseState;
    protected gameBase : any;
    public constructor(gameBase : any){
        this.gameBase = gameBase;
    }
    public setNextState(stateObject : GameBaseState) : void{
        this.nextState = GameBaseState;
    }
    public abstract prepare() : void;
    public abstract onState() : void;
    public abstract updateState(dt : number) : void;
    public abstract endState() : void;
}