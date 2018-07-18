import GameSystem from "../../GameSystem";
import {GameState} from "../GameState/GameBaseState";
interface Parameter{
    updateMoney : (money : number) => void;
    updateHP : (HP : number) => void;
    updateEnemyQuantity : (quantity : number) => void;
}
export default class InformationSystem extends GameSystem {
    private stageHP : number;
    private money : number;
    private updateMoney : (money : number) => void;
    private updateHP : (HP : number) => void;
    public constructor(gameBase : any, parameter : Parameter){
        super(gameBase);
        this.initialize(parameter);
    }
    private initialize(parameter : Parameter) : void{
        const data = this.gameBase.getDataBase().getStageData();
        this.stageHP = data.stageHP;
        this.money = data.money;
        this.updateHP = parameter.updateHP;
        this.updateMoney = parameter.updateMoney;
        this.updateEnemyQuantity = parameter.updateEnemyQuantity;
        this.updateHP(data.stageHP);
        this.updateMoney(data.money);
    }
    public enemyArriveEnd(PA : number) : void{
        const HP = (this.stageHP -= PA);
        if(HP == 0){
            this.gameBase.changeState(GameState.GAME_OVER, false);
        }
        this.updateHP(HP);
    }
    public getStageHP() : number{
        return this.stageHP;
}
    public changeMoney(number : number) : void{
        this.updateMoney(this.money += number);
    }
    public getMoney() : number{
        return this.money;
    }

    public updateEnemyQuantity : (quantity : number) => void;
}