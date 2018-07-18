import {Parse} from "../Common/Parse";
import {HeroType, HeroTypeMap} from "../Factory/CharacterFactory";

export interface HeroDataItem{
    id : string;
    name : string;
    maxMoveSpeed : number;
    maxHP : number;
    attackPower : number;
}
const MoveSpeedMap = new Map<string, number>([
    ["low", 100],
    ["middle", 200],
    ["high", 300]
]);
export default class HeroDataParse extends Parse{
    public parse(rawData : any) : Map<HeroType, HeroDataItem>{
        const heroData : Map<HeroType, HeroDataItem> = new Map();
        for(let item of rawData){
            heroData.set(this.getEmHero(item.id), this.parseHeroItem(item));
        }
        return heroData;
    }
    private getEmHero(id : string) : HeroType{
        return HeroTypeMap.get(id);
    }
    private parseHeroItem(item : any) : HeroDataItem{
        const id = this.getUniqueAttr<string>("id", item);
        const name = this.getUniqueAttr<string>("name", item);
        const maxMoveSpeed = this.getAttr<number>("maxMoveSpeed", item, MoveSpeedMap);
        const attackPower = this.getAttr<number>("attackPower", item, MoveSpeedMap);

        const maxHP = 100;
        return {id, name, maxMoveSpeed, maxHP, attackPower};
    }
}