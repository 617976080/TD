import ResourcesLoader from "../Common/ResourcesLoader";
import EnemyDataParse, {EnemyDataItem} from "./EnemyDataParse";
import {EnemyType, HeroType} from "../Factory/CharacterFactory";
import {HeroDataItem} from "./HeroDataParse";
import TowerDataParse, {TowerDataItem} from "./TowerDataParse";
import {TowerType} from "../Factory/TowerFactory";
import {EnemyWave, default as StageDataParse, StageData} from "./StageDataParse";

export default class GameDataBase {
    private EnemyDataUrl = "Data/enemyData";
    private TowerDataUrl = "Data/towerData";
    private stageData : StageData;
    private enemyData = new Map<string, EnemyDataItem>();
    private heroData = new Map<HeroType, HeroDataItem>();
    private towerData = new Map<TowerType, TowerDataItem>();
    private static _instance = null;
    public static get instance() : GameDataBase{
        return GameDataBase._instance;
    }
    constructor(LV : number){
        this.addLoad(LV);
        GameDataBase._instance = this;
    }
    private getStageDataUrl(stageLv : number) : string{
        return "Data/stageLv/" + stageLv;
    }
    private addLoad(LV : number){
        let stageResource;
        let enemyResource;
        let towerResource;
        ResourcesLoader.addGroup(
            "游戏数据",
            [
                {
                    url :this.getStageDataUrl(LV),
                    success : (resource) => {
                        stageResource = resource;
                    }
                },
                {
                    url :this.EnemyDataUrl,
                    success : (resource) => {
                        enemyResource = resource;
                    }
                },
                {
                    url :this.TowerDataUrl,
                    success : (resource) => {
                        towerResource = resource;
                    }
                },
            ],
            () => {
                const enemyDataParse = new EnemyDataParse();
                this.enemyData = enemyDataParse.parse(enemyResource);

                const stageDataParse = new StageDataParse();
                this.stageData = stageDataParse.parse(stageResource);

                const towerDataParse = new TowerDataParse();
                this.towerData = towerDataParse.parse(towerResource);
            }
        );
    }
    public getEnemyData(id : string) : EnemyDataItem{
        return this.enemyData.get(id);
    }
    public getHeroData(heroType : HeroType) : HeroDataItem{
        return this.heroData.get(heroType);
    }
    public getAllTowerData(){
        return this.towerData;
    }
    public getTowerData(towerType : TowerType) : TowerDataItem{
        return this.towerData.get(towerType);
    }
    public getStageData() : StageData{
        return this.stageData;
    }
}