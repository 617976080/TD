import BaseAttr from "./BaseAttr";
import Character from "../Character/Character";

export default abstract class CharacterAttr<T extends BaseAttr, K extends Character> {
    set moveSpeed(value: number) {
        this._moveSpeed = value;
    }
    protected baseAttr : T;
    public HP : number;
    public LV : number;
    protected _moveSpeed : number;
    protected character : K;
    public constructor(baseAttr : T, character : K) {
        this.baseAttr = baseAttr;
        this.HP = baseAttr.maxHP;
        this._moveSpeed = baseAttr.maxMoveSpeed;
        this.character = character;
    }
    get maxMoveSpeed() : number{
        return this.baseAttr.maxMoveSpeed;
    }
    get maxHP() : number{
        return this.baseAttr.maxHP;
    }
    get moveSpeed() : number{
        return this._moveSpeed;
    }
    public setNormalSpeed() : void{
        this._moveSpeed = this.baseAttr.maxMoveSpeed;
    }

}