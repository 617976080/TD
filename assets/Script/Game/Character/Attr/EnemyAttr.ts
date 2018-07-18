import CharacterAttr from "./CharacterAttr";
import EnemyBaseAttr from "./EnemyBaseAttr";
import {EnemyState, default as EnemyStateAbstract} from "./EnemyState";
import EnemyStateFrozen from "./EnemyStateFrozen";
import Enemy from "../Character/Enemy";

export default class EnemyAttr extends CharacterAttr<EnemyBaseAttr, Enemy>{
    private buffs = new Map<EnemyState, EnemyStateAbstract>();
    private buffCount = 0;
    get PD() : number{
        return this.baseAttr.PD;
    }
    get MD(){
        return this.baseAttr.MD;
    }
    get reward(){
        return this.baseAttr.reward;
    }
    public addBuff(second : number, state : EnemyState) : void{
        if(this.buffs.has(EnemyState)){
            const buff = this.buffs.get(EnemyState);
            buff.addSecond(second);
        }else{
            let stateObject : EnemyStateAbstract;
            switch(state){
                case EnemyState.FROZEN:
                    stateObject = new EnemyStateFrozen(second, this.character);
                    break;
            }
            this.buffs.set(state, stateObject);
        }
    }
    public update(dt : number) : void{
        this.buffs.forEach((value, key) => {
            value.update(dt);
        })

    }
    public hasBuff(state : EnemyState) : boolean{
        return this.buffs.has(EnemyState);
    }
}