import HeroComponent from "../../Component/HeroComponent";
import {HeroAnimation} from "../Character/Hero";
import CharacterBuilder from "./CharacterBuilder";

export default class HeroBuilder extends CharacterBuilder {
    protected initAnimation(characterId: string, baseComponent: HeroComponent) {
        const data = this.gameBase.getCharacterFactory().getAnimationRes<HeroAnimation>(characterId);
        data.forEach((spriteFrames , clipName) => {
            baseComponent.createAnimationClip(spriteFrames, clipName);
        });
    }

}