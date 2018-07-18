import BaseCharacterComponent from "../../Component/BaseCharacterComponent";
import Character, {CharacterAnimation, CharacterAnimationResMap} from "../Character/Character";
import GameBase from "../../GameBase";

export interface BuilderParameters{
    LV : number;
    id : string;
    buildPos : cc.Vec2;
}
export default abstract class CharacterBuilder{
    private prefab : cc.Prefab;
    protected gameBase : GameBase;
    constructor(gameBase : GameBase,prefab : cc.Prefab) {
        this.gameBase = gameBase;
        this.prefab = prefab;
    }
    public construct(character : Character, parameters : BuilderParameters) : void{
        const node = cc.instantiate(this.prefab);
        const baseComponent = node.getComponent<BaseCharacterComponent>(BaseCharacterComponent);
        this.initAnimation(parameters.id, baseComponent);
        node.setPosition(parameters.buildPos);
        character.baseComponent = baseComponent;
        character.characterAttr = this.gameBase.getAttributeFactory().getEnemyAttr(parameters.id);
        character.setFullHP();
        character.setNormalSpeed();
        character.setLV(parameters.LV);
        character.initialize();
    }
    protected abstract initAnimation(characterId : string, baseComponent : BaseCharacterComponent);

}