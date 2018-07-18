import Tower from "./Tower";

export default class CharacterTower extends Tower {
    public getCharacterRange() : number{
        return 3;
    }
}