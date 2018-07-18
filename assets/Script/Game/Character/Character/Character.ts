import BaseCharacterComponent from "../../Component/BaseCharacterComponent";
import CharacterAttr from "../Attr/CharacterAttr";
export const WalkSample = 10;
export enum CharacterAnimation{
    WALK_UP = "up",
    WALK_RIGHT = "right",
    WALK_DOWN = "down",
    WALK_LEFT = "left",
    DEAD_UP = "dead_up",
    DEAD_RIGHT = "dead_right",
    DEAD_DOWN = "dead_down",
    DEAD_LEFT = "dead_left",
}
export const CharacterAnimationResMap = new Map<string, CharacterAnimation>([
    ["up", CharacterAnimation.WALK_UP],
    ["right", CharacterAnimation.WALK_RIGHT],
    ["down", CharacterAnimation.WALK_DOWN],
    ["left", CharacterAnimation.WALK_LEFT],
    ["dead_up", CharacterAnimation.DEAD_UP],
    ["dead_right", CharacterAnimation.DEAD_RIGHT],
    ["dead_down", CharacterAnimation.DEAD_DOWN],
    ["dead_left", CharacterAnimation.DEAD_LEFT]
]);
export default abstract class Character<T extends CharacterAttr>{
    get baseComponent(): BaseCharacterComponent {
        return this._baseComponent;
    }
    get characterAttr(): T {
        return this._characterAttr;
    }
    protected _characterAttr : T;
    protected _baseComponent : BaseCharacterComponent;
    public static count = 0;
    protected _uniqueId = Character.count++;
    protected constructor(){
    }
    public abstract initialize() : void;
    public abstract setCharacterType(param : any) : void;
    public abstract getCharacterType() : string;
    get uniqueId() : number{
        return this._uniqueId;
    }
    set characterAttr(value : T){
        this._characterAttr = value;
    }
    set baseComponent(component : BaseCharacterComponent){
        this._baseComponent = component;
    }
    get node(){
        return this._baseComponent.node;
    }
    public getMaxMoveSpeed() : number{
        return this._characterAttr.maxMoveSpeed;
    }
    public getMaxHP() : number{
        return this._characterAttr.maxHP;
    }
    public setNormalSpeed() : void{
        this._characterAttr.setNormalSpeed();
    }
    public setFullHP() : void{
        this.setHP(this._characterAttr.maxHP);
    }
    public setHP(HP : number) : void{
        const characterAttr = this._characterAttr;
        characterAttr.HP = HP;
        this._baseComponent.setHPPercentage(HP / characterAttr.maxHP);
    }
    public update(dt : number) : void{

    }
    public setLV(LV : number) : void{
        this._baseComponent.setLV(LV);
        this._characterAttr.LV = LV;
    }
}