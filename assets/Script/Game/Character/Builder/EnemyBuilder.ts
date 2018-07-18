import CharacterBuilder, {BuilderParameters} from "./CharacterBuilder";
import BaseCharacterComponent from "../../Component/BaseCharacterComponent";
import Character, {CharacterAnimation} from "../Character/Character";
import Enemy from "../Character/Enemy";

export default class EnemyBuilder extends CharacterBuilder {
    public construct(character : Enemy, parameters : BuilderParameters, wayId : number) : void{
        character.wayId = wayId;
        super.construct(character, parameters);
    }
    private initAnimation(characterId : string, baseComponent : BaseCharacterComponent){
        const data = this.gameBase.getCharacterFactory().getAnimationRes<CharacterAnimation>(characterId);
        data.forEach((spriteFrames , clipName) => {
            baseComponent.createAnimationClip(spriteFrames, clipName);
        });
    }

}