export default abstract class BaseAttr{
    private _maxMoveSpeed : number;
    private _maxHP : number;
    protected constructor(maxMoveSpeed : number, maxHP : number){
        this._maxMoveSpeed = maxMoveSpeed;
        this._maxHP = maxHP;
    }
    get maxMoveSpeed(): number {
        return this._maxMoveSpeed;
    }
    get maxHP(): number {
        return this._maxHP;
    }
}