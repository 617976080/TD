import CharacterAttr from "./BaseAttr";

export default class HeroBaseAttr extends CharacterAttr{
    get attackInterval(): number {
        return this._attackInterval;
    }
    get attackRange(): number {
        return this._attackRange;
    }
    private _maxAttackPower : number;
    private _attackRange : number;
    private _attackInterval : number;
    public constructor(data : {maxMoveSpeed : number, maxHP : number, attackPower : number, attackRange : number, attackInterval : number}){
        super(data.maxMoveSpeed, data.maxHP);
        this._maxAttackPower = data.attackPower;
        this._attackRange = data.attackRange;
        this._attackInterval = data.attackInterval;
    }
    get maxAttackPower(): number {
        return this._maxAttackPower;
    }
    ger
}