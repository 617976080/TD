import {EnemyType, HeroType} from "./CharacterFactory";
import GameDataBase from "../DataBase/GameDataBase";
import EnemyAttr from "../Character/Attr/EnemyAttr";
import HeroAttr from "../Character/Attr/HeroAttr";
import EnemyBaseAttr from "../Character/Attr/EnemyBaseAttr";
import HeroBaseAttr from "../Character/Attr/HeroBaseAttr";
import GameSystem from "../../GameSystem";
export default class AttributeFactory extends GameSystem{
    private enemyBaseAttrCache = new Map<string, EnemyBaseAttr>();
    private heroBaseAttrCache = new Map<HeroType, HeroBaseAttr>();

    public getEnemyAttr(id : string) : EnemyAttr{
        let baseAttr = this.enemyBaseAttrCache.get(id);
        if(baseAttr == null){
            const data = GameDataBase.instance.getEnemyData(id);
            baseAttr = new EnemyBaseAttr(data);
            this.enemyBaseAttrCache.set(id, baseAttr);
        }
        return new EnemyAttr(baseAttr);
    }
    public getHeroAttr(heroType : HeroType) : HeroAttr{
        let baseAttr = this.heroBaseAttrCache.get(heroType);
        if(baseAttr == null){
            const data = GameDataBase.instance.getHeroData(heroType);
            baseAttr = new HeroBaseAttr(data);
            this.heroBaseAttrCache.set(heroType, baseAttr);
        }
        return new HeroAttr(baseAttr);
    }
}