import GameBaseState from "./GameBaseState";

export default class GameBaseStartState extends GameBaseState{
    prepare(): void {
    }

    onState(): void {

    }

    updateState(dt : number): void {
        this.gameBase.getStageSystem().update(dt);
        this.gameBase.getCharacterManager().update(dt);
        this.gameBase.getTowerSystem().update(dt);
    }

    endState(): void {
    }

}