const {ccclass, property} = cc._decorator;
@ccclass
export default class MainToolBtn extends cc.Component {
    @property({
        type : cc.SpriteFrame,
        default : null
    })
    private normalIco : cc.SpriteFrame;

    @property({
        type : cc.SpriteFrame,
        default : null
    })
    private activeIco : cc.SpriteFrame;

    private sprite : cc.Sprite;

    public onLoad(): void {
        const sprite = this.node.addComponent(cc.Sprite);
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        sprite.spriteFrame = this.normalIco;

        this.sprite = sprite;
    }
    private _isActive = false;
    public init(toNormalFn : Function, toActiveFn : Function){
        this.node.on("touchstart", () => {
            this._isActive = !this._isActive;
            if(this._isActive){
                toActiveFn();
                this.sprite.spriteFrame = this.activeIco;
            }else{
                toNormalFn();
                this.sprite.spriteFrame = this.normalIco;
            }
        });

    }
    get active(){
        return this._isActive;
    }

}