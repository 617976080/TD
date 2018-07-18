import {default as Tower, TowerAnimation, TowerExample} from "../Tower/Tower";
import {TowerDetailItem} from "../DataBase/TowerDataParse";
import Global from "../Common/Global";
import Scheduler = cc.Scheduler;
const A = 180 / Math.PI;
const {ccclass, property} = cc._decorator;
@ccclass
export default class BaseTowerComponent extends cc.Component {
    private locusClip: cc.AnimationClip;
    get tower(): Tower {
        return this._tower;
    }

    @property({
        type : cc.Label,
        default : null
    })
    private LVLabel : cc.Label;

    private towerAnimation : cc.Animation;
    @property({
        type : cc.Node,
        default : null
    })
    private towerNode : cc.Node;

    @property({
        type : cc.Prefab,
        default : null
    })
    private locusPrefab : cc.Prefab;

    @property({
        type : cc.NodePool,
        default : null
    })
    private locusPool : cc.NodePool;

    private locusFrameCount : number;

    private effectNodePool : cc.NodePool;
    private effectClip : cc.AnimationClip;

    private mapNode : cc.Node;

    private  _tower : Tower;

    @property({
        type : cc.Node,
        default : null
    })
    private rangeNode : cc.Node;

    private hideRangeCallFn : Function;
    public initialize(mapNode : cc.Node, tower : Tower) : void{
        this.towerAnimation = this.towerNode.getComponent<cc.Animation>(cc.Animation);
        this.effectNodePool = new cc.NodePool(cc.Node);
        this.locusPool = new cc.NodePool(cc.Node);
        this.mapNode = mapNode;
        this._tower = tower;
        this.rangeNode.active = false;
    }
    public initSpriteFrame(spriteFrame : cc.SpriteFrame) : void{
        const sprite = this.towerNode.getComponent<cc.Sprite>(cc.Sprite);
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        sprite.spriteFrame = spriteFrame;
    }
    public setLV(LV : number, attribute : TowerDetailItem) : void{
        this.LVLabel.string = "LV:" + LV;
        const a = attribute.range * Global.getGameBase().getCharacterManager().getDistancePXOneRange();
        this.rangeNode.setContentSize(new cc.Size(a,a));
    }
    public createAnimationClip(sprites : cc.SpriteFrame[], animation : TowerAnimation) : void{
        let clip = cc.AnimationClip.createWithSpriteFrames(sprites, TowerExample);
        let component : cc.Animation;
        switch(animation){
            case TowerAnimation.ATTACK_LOCUS:
                this.locusClip = clip;
                this.locusFrameCount = sprites.length;
                return;
                break;
            case TowerAnimation.EFFECT:
                this.effectClip = clip;
                return;
                break;
            default :
                component = this.towerAnimation;
                break;
        }
        component.addClip(clip, animation + "");
    }
    public playAnimation(animation : TowerAnimation){
        this.towerAnimation.play(animation + "").wrapMode = cc.WrapMode.Loop;
    }
    public playLocusAndEffect(towerPos : cc.Vec2, targetPos : cc.Vec2){
        this.rangeNode.active = true;
        this.unschedule(this.hideRangeCallFn);


        let locusNode = this.locusPool.get();
        if(locusNode == null){
            locusNode = cc.instantiate(this.locusPrefab);
            locusNode.getComponent<cc.Animation>(cc.Animation).addClip(this.locusClip,TowerAnimation.ATTACK_LOCUS + "")
        }
        this.mapNode.addChild(locusNode);
        locusNode.setPosition(towerPos);
        locusNode.runAction(cc.sequence(cc.moveTo(this.locusFrameCount / TowerExample, targetPos), cc.callFunc(() =>{
            this.locusPool.put(locusNode);
        })));
        locusNode.rotation = this.getRotation(towerPos, targetPos) + 90;
        locusNode.getComponent<cc.Animation>(cc.Animation).play(TowerAnimation.ATTACK_LOCUS + "").wrapMode = cc.WrapMode.Loop;


        let effectNode = this.effectNodePool.get();
        if(effectNode == null){
            effectNode = new cc.Node();
            const sprite = effectNode.addComponent(cc.Sprite);
            sprite.SizeMode = cc.Sprite.SizeMode.RAW;
            const animation = effectNode.addComponent(cc.Animation);
            animation.addClip(this.effectClip, TowerAnimation.EFFECT + "");
        }
        this.mapNode.addChild(effectNode);
        const animationComponent = effectNode.getComponent<cc.Animation>(cc.Animation);
        effectNode.setPosition(targetPos);
        animationComponent.play(TowerAnimation.EFFECT + "").wrapMode = cc.WrapMode.Normal;
        animationComponent.on("finished", () => {
            effectNode.removeFromParent();
            if(this.hideRangeCallFn){
                this.unschedule(this.hideRangeCallFn);
            }
            const scheduler = () => {
                this.rangeNode.active = false;
            };
            this.scheduleOnce(scheduler, 0.1);
            this.hideRangeCallFn = scheduler;
        });
    }
    private getRotation(towerPos : cc.Vec2, targetPos : cc.Vec2) : number{
        const rotation = cc.pAngle(towerPos, targetPos) * A;
        return towerPos.y > targetPos.y ? rotation : - rotation;
    }
    public playSpin(spriteFrames : cc.SpriteFrame[]){
        this.rangeNode.active = true;
        this.createAnimationClip(spriteFrames, TowerAnimation.SPIN);
        this.towerAnimation.play(TowerAnimation.SPIN + "").wrapMode = cc.WrapMode.Normal;
    }
}