import CharacterAttr from "./BaseAttr";

export default class EnemyBaseAttr extends CharacterAttr{
    private _PD : number;
    private _MD : number;
    private _reward : number;
    public constructor(data : {PD : number, MD : number, maxMoveSpeed : number, maxHP : number, reward : number}){
        super(data.maxMoveSpeed, data.maxHP);
        this._PD = data.PD;
        this._MD = data.MD;
        this._reward = data.reward;
    }
    get PD() : number{
        return this._PD;
    }
    get MD() : number{
        return this._MD;
    }
    get reward(): number {
        return this._reward;
    }
}