import {CharacterAnimation, WalkSample} from "../Character/Character/Character";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BaseCharacterComponent extends cc.Component {
    @property({
        type : cc.Label,
        default : null
    })
    private LVLabel : cc.Label;

    protected animation : cc.Animation;

    @property({
        type : cc.ProgressBar,
        default : null
    })
    private HPBar : cc.ProgressBar;

    @property({
        type : cc.Node,
        default : null
    })
    private characterNode : cc.Node;
    public setLV(LV : number) : void{
        this.LVLabel.string = "LV:" + LV;
    }
    public setHPPercentage(precentage : number){
        if(precentage > 1){
            throw new Error("Percentage must be in range (0,1)");
        }
        this.HPBar.progress = precentage;
    }
    public createAnimationClip(sprites : cc.SpriteFrame[], animation : any, sample ? : number) : void{
        this.animation = this.characterNode.getComponent<cc.Animation>(cc.Animation);
        let clip = cc.AnimationClip.createWithSpriteFrames(sprites, sample || WalkSample);
        this.animation.addClip(clip, animation + "");
    }
    public playAnimation(animation : any){
        let clipName : any;
        if(animation == CharacterAnimation.WALK_LEFT){
            clipName = CharacterAnimation.WALK_RIGHT;
            this.characterNode.scaleX = -1;
        }else{
            clipName = animation;
            this.characterNode.scaleX = 1;
        }
        this.animation.play(clipName).wrapMode = cc.WrapMode.Loop;
    }
}