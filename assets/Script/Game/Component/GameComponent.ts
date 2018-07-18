import GameBase from "../GameBase";
import CountDown from "./CountDown";
import MapComponent from "./MapComponent";
import UI from "../UI/UI";

const {ccclass, property} = cc._decorator;
@ccclass
export default class GameComponent extends cc.Component {
    @property({
        type : CountDown,
        default : null
    })
    private countDown : CountDown;

    @property({
        type : cc.Prefab,
        default : null
    })
    private characterPrefab : cc.Prefab;

    @property({
        type : cc.Prefab,
        default : null
    })
    private towerPrefab : cc.Prefab;

    @property({
        type : MapComponent,
        default : null
    })
    private mapComponent : MapComponent;

    private gameBase : GameBase = null;

    @property({
        type : UI,
        default : null
    })
    private UI : UI;

    @property({
        type : cc.SpriteAtlas,
        default : null
    })
    private TD : cc.SpriteAtlas;

    @property({
        type : cc.SpriteAtlas,
        default : null
    })
    private gameUISpriteAtlas : cc.SpriteAtlas;
    public onLoad() : void {
        this.gameBase = new GameBase(this.UI, this.node, this.countDown, this.mapComponent, this.characterPrefab,this.towerPrefab, this.TD, this.gameUISpriteAtlas);
    }
    public update(dt : number) : void{
        if(!this.gameBase) return;
        this.gameBase.update(dt);
    }
}