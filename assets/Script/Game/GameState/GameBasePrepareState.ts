import GameBaseState, {GameState} from "./GameBaseState";

export default class GameBasePrepareState extends GameBaseState{
    public prepare() : void{

    }
    public onState(): void {
        const gameBase = this.gameBase;
        gameBase.countDownComponent.run(() => {
            gameBase.changeState(GameState.GAME_START);
        });
    }
    public updateState(dt : number): void {

    }

    public endState(): void {

    }

}