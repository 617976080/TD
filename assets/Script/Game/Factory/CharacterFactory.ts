import Enemy from "../Character/Character/Enemy";
import Hero from "../Character/Character/Hero";
import EnemyNormal from "../Character/Character/EnemyNormal";
import {HeroNormal} from "../Character/Character/HeroNormal";
import GameSystem from "../../GameSystem";
import AttributeFactory from "./AttributeFactory";
import {CharacterAnimation, CharacterAnimationResMap} from "../Character/Character/Character";
import CharacterBuilder from "../Character/Builder/CharacterBuilder";
import EnemyBuilder from "../Character/Builder/EnemyBuilder";
import HeroBuilder from "../Character/Builder/HeroBuilder";

export enum EnemyType{
    DEER = 1,
    STONE = 2
}
export const EnemyTypeMap = new Map<string, EnemyType>([
    ["deer", EnemyType.DEER],
    ["stone", EnemyType.STONE]
]);
export const EnemyIdMap = new Map<EnemyType, string>();
(function () {
    EnemyTypeMap.forEach((value , key) => {
        EnemyIdMap.set(value, key);
    })
})();


export enum HeroType{
    ARROW_HERO = 1
}
export const HeroTypeMap = new Map<string, HeroType>([
    ["arrow_hero", HeroType.ARROW_HERO],
]);
export const HeroIdMap = new Map<HeroType, string>();
(function () {
    HeroTypeMap.forEach((value , key) => {
        HeroIdMap.set(value, key);
    })
})();


export default class CharacterFactory extends GameSystem{
    private attributeFactory : AttributeFactory;
    private sprites = new Map<string, Map<CharacterAnimation, cc.SpriteFrame[]>>();
    private enemyBuilder : EnemyBuilder;
    private heroBuilder : HeroBuilder;
    public constructor(gameBase : any, prefab : cc.Prefab){
        super(gameBase);
        this.initialize(prefab);
    }
    protected initialize(prefab : cc.Prefab) : void{
        this.attributeFactory = this.gameBase.getAttributeFactory();
        this.enemyBuilder = new EnemyBuilder(this.gameBase, prefab);
        this.heroBuilder = new HeroBuilder(this.gameBase, prefab);

        Enemy.setMapSystem(this.gameBase);
    }
    public createEnemy(emEnemy : EnemyType, pos : cc.Vec2, wayId : number) : Enemy{
        let enemy : Enemy;
        switch (emEnemy){
            default :
                enemy = new EnemyNormal();
                break;
        }
        this.enemyBuilder.construct(enemy, {LV : 1, buildPos : pos, id : EnemyIdMap.get(emEnemy)}, wayId);
        this.gameBase.getCharacterManager().addEnemy(enemy);
        return enemy;
    }
    public createHero(emHero : HeroType, pos : cc.Vec2) : Hero{
        let hero : Hero;
        switch (emHero){
            default :
                hero = new HeroNormal();
                break;
        }
        this.heroBuilder.construct(hero, {LV : 1, buildPos : pos, id : HeroIdMap.get(emHero)});
        hero.characterAttr = this.attributeFactory.getHeroAttr(emHero);
        return hero;
    }
    public initAnimationRes(resources : cc.SpriteAtlas[], enemyId : string) :void{
        this.gameBase.getAnimationManager().addAnimationGroupRes<CharacterAnimation>(resources, enemyId, CharacterAnimationResMap);
    }
    public getAnimationRes<T>(characterId : string) : Map<T, cc.SpriteFrame[]>{
        return this.gameBase.getAnimationManager().getAnimationGroupRes(characterId);
    }
}