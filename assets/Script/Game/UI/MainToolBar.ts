import GameComponent from "../Component/GameComponent";
import GameBase from "../GameBase";
import Global from "../Common/Global";
import MainToolBtn from "./MainToolBtn";
import MapComponent from "../Component/MapComponent";

const {ccclass, property} = cc._decorator;
@ccclass
export default class MainToolBar extends cc.Component {
    private game : GameBase;

    @property({
        type : MainToolBtn,
        default : null
    })
    private stopBtn : MainToolBtn;

    @property({
        type : MainToolBtn,
        default : null
    })
    private speedUpBtn : MainToolBtn;

    @property({
        type : MainToolBtn,
        default : null
    })
    private settingBtn : MainToolBtn;

    @property({
        type : cc.Node,
        default : null
    })
    private settingPanel : cc.Node;
    
    @property({
        type : MapComponent,
        default : null
    })
    private mapComponent : MapComponent;
    public start() : void{
        this.game = Global.getGameBase();
        this.stopBtn.init(() => {
            this.game.resume();
        }, () => {
            this.game.pause();
        });
        this.speedUpBtn.init(() => {
            this.game.disSpeedUp();
        }, () => {
            this.game.speedUp();
        });
        this.settingBtn.init(() => {
            this.settingPanel.active = false;
            if(this.stopBtn.active === false){
                this.game.resume();
            }
        }, () => {
            this.game.pause();
            this.settingPanel.active = true;
        });
    }

}