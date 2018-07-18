import TowerPanel from "./TowerPanel";
import GameOver from "./GameOver";

const {ccclass, property} = cc._decorator;
@ccclass
export default class UI extends cc.Component {
    @property({
        type : cc.Label,
        default : null
    })
    private enemyQuantityLabel : cc.Label;

    @property({
        type : cc.Label,
        default : null
    })
    private stageHPLabel : cc.Label;

    @property({
        type : cc.Label,
        default : null
    })
    private moneyLabel : cc.Label;

    @property({
        type : TowerPanel,
        default : null
    })
    private towerPanel : TowerPanel;


    @property({
        type : GameOver,
        default : null
    })
    private gameOverComponent : GameOver;
    public onLoad(): void {
        //this.node.on("touchstart", this.onTouch);
    }
    private onTouch = (event : cc.Event) : void =>{
        this.towerPanel.cancelCommend();
    };
    public updateEnemyQuantity = (quantity : number) : void => {
        this.enemyQuantityLabel.string = quantity + "";
    };
    public updateStageHP = (hp : number) : void => {
        this.stageHPLabel.string = hp + "";
    };
    public updateMoney = (money : number) : void => {
        this.moneyLabel.string = money + "";
        this.towerPanel.updateData(money);
    };
    public gameOver = (isWin : boolean) =>{
        this.gameOverComponent.show(isWin);
    }
}