import Character from "./Character";
import HeroAttr from "../Attr/HeroAttr";
import {HeroType} from "../../Factory/CharacterFactory";
import Enemy from "./Enemy";
import CharacterTower from "../../Tower/CharacterTower";
import Global from "../../Common/Global";
import HeroWaitState from "./HeroWaitState";
import HeroAttackState from "./HeroAttackState";
import HeroStateAbstract from "./HeroState";
export const enum HeroState{
    WAIT,
    ATTACK
}
export const enum HeroAnimation{
    ATTACK_0 = "attack_0",
    ATTACK_45 = "attack_45",
    ATTACK_90 = "attack_90",
    ATTACK_135 = "attack_135",
    ATTACK_180 = "attack_180",
    ATTACK_225 = "attack_225",
    ATTACK_270 = "attack_270",
    ATTACK_315 = "attack_315",
}
export const HeroAnimationMap = new Map<string, HeroAnimation>([
    ["attack_0", HeroAnimation.ATTACK_0],
    ["attack_45", HeroAnimation.ATTACK_45],
    ["attack_90", HeroAnimation.ATTACK_90],
    ["attack_135", HeroAnimation.ATTACK_135],
    ["attack_180", HeroAnimation.ATTACK_180],
    ["attack_225", HeroAnimation.ATTACK_225],
    ["attack_270", HeroAnimation.ATTACK_270],
    ["attack_315", HeroAnimation.ATTACK_315],
]);
export default abstract class Hero extends Character<HeroAttr>{
    get liveDuration(): number {
        return this._liveDuration;
    }

    set liveDuration(second: number) {
        this._liveDuration = second * 1000;
    }
    set prevTarget(value: Enemy) {
        this._prevTarget = value;
    }
    get belongBuild(): CharacterTower {
        return this._belongBuild;
    }
    get prevTarget(): Enemy {
        return this._prevTarget;
    }
    private heroType : any;
    private _prevTarget : Enemy;
    private _belongBuild : CharacterTower;
    private searchRange : number;
    private elapsed : number = 0;
    private stateObject : HeroStateAbstract;
    public direction : number;
    public spinAtlas : cc.SpriteAtlas;
    private _liveDuration : number;
    private static defaultDirection = 0;
    public setCharacterType(param: HeroType): void {
        this.heroType = param;
    }
    public changeState(state : HeroState) : void{
        let object;
        switch(state){
            case HeroState.WAIT:
                object = new HeroWaitState(this);
                break;
            case HeroState.ATTACK:
                object = new HeroAttackState(this);
                break;
        }
        this.stateObject = object;
    }
    public getSearchRange() : number{
        if(this.searchRange) return this.searchRange;
        return this.searchRange = this.characterAttr.attackRange;
    }
    public getCharacterType(): string {
        return this.heroType;
    }
    public update(dt : number) : void{
        this.stateObject.update(dt);
        const attr = this.characterAttr;
        attr.HP -= dt / this._liveDuration * attr.maxHP;
        if(attr.HP <= 0){
            attr.HP = 0;
            this.dead();
        }
    }
    public dead() : void{
        Global.getGameBase().getCharacterManager().removeHero(this);
    }
    constructor() {
        super();
        this.changeState(HeroState.WAIT);
        this.direction = Hero.defaultDirection;
    }
}