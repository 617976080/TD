const {ccclass, property} = cc._decorator;
@ccclass
export default class CountDown extends cc.Component {
    @property({
        type : cc.Node,
        default : null
    })
    private wordNode : cc.Node;

    @property({
        type : cc.SpriteFrame,
        default : []
    })
    private words : cc.SpriteFrame[];

    @property({
        type : cc.SpriteFrame,
        default : null
    })
    private go : cc.SpriteFrame;

    private wordSprite : cc.Sprite;

    @property({
        type : cc.Node,
        default : null
    })
    private lightNode : cc.Node;
    public onLoad() : void {
        this.wordSprite = this.wordNode.getComponent<cc.Sprite>(cc.Sprite);
        this.node.active = false;
    }
    public run(callFn : () => void) : void{
        const sprite = this.wordSprite;
        const words = this.words;
        const amount = words.length;
        let time = amount;
        this.node.active = true;
        this.lightNode.runAction(cc.repeat(cc.rotateBy(1,360), amount + 1));
        this.schedule(() => {
            sprite.spriteFrame = words[time - 1];
            time--;
            if(time === 0){
                this.scheduleOnce(() => {
                    callFn();
                    sprite.sizeMode = cc.Sprite.SizeMode.RAW;
                    sprite.spriteFrame = this.go;
                    this.scheduleOnce(() => {
                        this.unscheduleAllCallbacks();
                        this.node.active = false;
                    },1);
                }, 1);
            }
        }, 1, amount);
    }

}