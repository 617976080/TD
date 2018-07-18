import {Parse} from "../Common/Parse";
import {TowerType, TowerTypeMap} from "../Factory/TowerFactory";
export interface TowerDataItem{
    id : string;
    name : string;
    detail : TowerDetailItem[];
}
export interface TowerDetailItem{
    range : number;
    cast : number;
    PA : number;
    weakSpeedSecond : number;
    attackInterval : number;
    spawnAttack : boolean;
}
export default class TowerDataParse extends Parse {
    public parse(rawData: any) {
        if(!Array.isArray(rawData)){
            throw new Error("Tower Data must be a array.");
        }
        const result = new Map<TowerType, TowerDataItem>();
        for(let tower of rawData){
            let towerDataItem : TowerDataItem;
            this.checkAttributes(tower, "id", "name", "detail");
            const id = this.getAttr<string>("id", tower);
            const name = this.getAttr<string>("name",tower);
            const detail = this.getDetail(tower.detail);
            const towerType = TowerTypeMap.get(id);
            if(towerType == null){
                throw new Error("Tower " + name + " is not exist.");
            }
            result.set(towerType,{id, name, detail});
        }
        return result;
    }
    private getDetail(detail : any){
        if(!Array.isArray(detail)){
            throw new Error("Detail must be a array.");
        }
        let result : TowerDetailItem[] = [];
        for(let item of detail){
            this.checkAttributes(item, "cast","range");
            const range = this.getAttr<number>("range",item);
            const cast = this.getAttr<number>("cast",item);
            const PA = this.getAttr<number>("PA",item, 0);
            const weakSpeedSecond = this.getAttr<number>("weakSpeedSecond",item, 0);
            const attackInterval = this.getAttr<number>("attackInterval", item, 0.5);
            const spawnAttack = this.getAttr<boolean>("spawnAttack",item);
            result.push({range, cast, PA, weakSpeedSecond, attackInterval, spawnAttack});
        }
        return result;
    }

}