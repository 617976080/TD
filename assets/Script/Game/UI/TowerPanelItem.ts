import Color = cc.Color;

const {ccclass, property} = cc._decorator;
@ccclass
export default class TowerPanelItem extends cc.Component {
    @property({
        type : cc.Label,
        default : null
    })
    private castLabel : cc.Label;

    private normal : cc.SpriteFrame;
    private disable : cc.SpriteFrame;
    private cast : number;
    private _isDisable : boolean;
    @property({
        type : cc.Sprite,
        default : null
    })
    private iconSprite : cc.Sprite;
    public init(normal : cc.SpriteFrame, disable : cc.SpriteFrame,cast : number, currentMoney : number) : void{
        this.normal = normal;
        this.disable = disable;
        this.cast = cast;
        this.castLabel.string = cast + "";
        this.updateData(currentMoney);
    }
    public updateData(currentMoney : number) : void{
        if(currentMoney < this.cast){
            this.iconSprite.spriteFrame = this.disable;
            this.castLabel.node.color = Color.GRAY;
            this._isDisable = true;
        }else{
            this.iconSprite.spriteFrame = this.normal;
            this.castLabel.node.color = Color.WHITE;
            this._isDisable = false;
        }
    }
    get isDisable(): boolean {
        return this._isDisable;
    }
}