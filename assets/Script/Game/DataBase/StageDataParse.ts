import {Parse} from "../Common/Parse";
import {EnemyType, EnemyTypeMap} from "../Factory/CharacterFactory";
import {TowerIdMap, TowerType, TowerTypeMap} from "../Factory/TowerFactory";
export interface EnemyWaveItem{
    time : number;
    enemyType : EnemyType;
    enemyId : string;
}
export interface EnemyWave{
    enemies : EnemyWaveItem[];
    wayId : number;
}
export interface StageData{
    stageHP : number;
    money : number;
    towers : string[];
    enemyWaves : EnemyWave[];
}
export default class StageDataParse extends Parse{
    public parse(rawData : any) : StageData{
        if(typeof rawData != "object"){
            throw new Error("Stage Data is error!");
        }
        this.checkAttributes(rawData, "stageHP", "money", "towers", "enemyWaves");
        const stageHP = this.getAttr<number>("stageHP", rawData);
        const money = this.getAttr<number>("money", rawData);
        const tower = this.getAllowTowers(rawData.towers);
        const enemyWaves = this.getEnemyWave(rawData.enemyWaves);
        return {stageHP, money, towers: tower, enemyWaves};
    }
    private getAllowTowers(data : any) : string[]{
        if(!Array.isArray(data)){
            throw new Error("Allow Towers of stage is illegal");
        }
        for(let towerId of data){
            if(!TowerTypeMap.has(towerId)){
                throw new Error("Tower id \"" + towerId + "\" is illegal!")
            }
        }
        return data;
    }
    private getEnemyWave(rawData : any) : EnemyWave[]{
        if(!Array.isArray(rawData)){
            throw new Error("EnemyWaves of Stage is illegal");
        }
        const result :EnemyWave[] = [];
        for(let item of rawData){
            if(typeof item != "object"){
                throw new Error("Stage wave data is illegal");
            }
            this.checkAttributes(item, "enemies", "wayId");
            const enemies = this.getEnemies(item.enemies);
            const wayId = this.getAttr<number>("wayId", item);
            result.push({enemies, wayId});
        }
        return result;
    }
    private getEnemies(data : any) : EnemyWaveItem[]{
        if(!Array.isArray(data)){
            throw new Error("enemy items is illegal");
        }
        let enemies : EnemyWaveItem[] = [];
        for(let item of data){
            this.checkAttributes(item, "time","enemyId");
            const time = this.getAttr<number>("time", item);
            const enemyId = this.getAttr<string>("enemyId",item);
            const enemyType = EnemyTypeMap.get(enemyId);
            enemies.push({time, enemyType, enemyId});
        }
        return enemies;
    }
}