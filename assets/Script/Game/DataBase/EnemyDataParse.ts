import {Parse} from "../Common/Parse";
import {EnemyType, EnemyTypeMap} from "../Factory/CharacterFactory";

export interface EnemyDataItem{
    id : string;
    name : string;
    maxMoveSpeed : number;
    PD : number;
    MD : number;
    maxHP : number;
    reward : number;
}
const MoveSpeedMap = new Map<string, number>([
    ["low", 10],
    ["middle", 30],
    ["high", 50]
]);
const PDMap = new Map<string, number>([
    ["low", 20],
    ["middle", 40],
    ["high", 60]
]);
const MDMap = new Map<string, number>([
    ["low", 20],
    ["middle", 40],
    ["high", 60]
]);
export default class EnemyDataParse extends Parse{
    public parse(rawData : any) : Map<string, EnemyDataItem>{
        const enemyData : Map<string, EnemyDataItem> = new Map();
        for(let item of rawData){
            enemyData.set(item.id, this.parseEnemyItem(item));
        }
        return enemyData;
    }
    private parseEnemyItem(item : any) : EnemyDataItem{
        const id = this.getUniqueAttr<string>("id", item);
        const name = this.getUniqueAttr<string>("name", item);
        const maxMoveSpeed = this.getAttrByMap<number>("maxMoveSpeed", item, MoveSpeedMap);
        const PD = this.getAttrByMap<number>("PD", item, PDMap);
        const MD = this.getAttrByMap<number>("MD", item, MDMap);
        const reward = this.getAttr<number>("reward", item);
        const maxHP = 100;
        return {id, name, maxMoveSpeed, PD, MD, reward,maxHP};
    }
}