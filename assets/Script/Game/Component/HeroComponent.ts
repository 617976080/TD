import BaseCharacterComponent from "./BaseCharacterComponent";

const {ccclass, property} = cc._decorator;
@ccclass

const SPIN_ANIMATION_ID = "spin";
export default class HeroComponent extends BaseCharacterComponent {
    public onLoad(): void {
    }
    public playSpin(spriteFrames : cc.SpriteFrame[]){
        this.createAnimationClip(spriteFrames, SPIN_ANIMATION_ID);
        this.animation.play(SPIN_ANIMATION_ID).wrapMode = cc.WrapMode.Normal;
    }
    public playAnimation(animation : any){
        this.animation.play(animation).wrapMode = cc.WrapMode.Loop;
    }
}