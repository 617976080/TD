import GameBaseState from "./GameBaseState";
import Global from "../Common/Global";

export default class GameOverState extends GameBaseState {
    private isWin : boolean;
    constructor(gameBase : any, isWin : boolean){
        super(gameBase);
        this.isWin = isWin;
    }
    prepare(): void {
    }

    onState(): void {
        Global.GoNextLV();
        this.gameBase.UI.gameOver(this.isWin);
    }

    updateState(dt: number): void {
    }

    endState(): void {
    }

}