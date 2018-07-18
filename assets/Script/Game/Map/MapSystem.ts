import GameSystem from "../../GameSystem";
import ResourcesLoader from "../Common/ResourcesLoader";
import MapComponent, {Way} from "../Component/MapComponent";
import TiledMapAsset = cc.TiledMapAsset;
import Character from "../Character/Character/Character";
import {TowerIdMap, TowerType, TowerTypeMap} from "../Factory/TowerFactory";
import Tower from "../Tower/Tower";
interface MapSystemParameter{
    LV : number;
    money : number;
    towers : Array<{id : string, cast : number}>;
}
enum TiledTag{
    TOWER,
    CHARACTER,
    NONE
}
export default class MapSystem extends GameSystem {
    get component(): MapComponent {
        return this._component;
    }
    private _component : MapComponent;
    private tmxAsset : TiledMapAsset;
    private mapIcons : cc.SpriteAtlas[];
    private enemyWay : Way[];
    private activePos : cc.Vec2[];
    private towerMap = new Map<cc.Vec2, Tower>();
    public constructor(gameBase : any, component : MapComponent, stageLV : number){
        super(gameBase);
        this.initialize(component, stageLV);
    }
    protected initialize(component : MapComponent, stageLV : number): void {
        this._component = component;
        this.addLoad(stageLV, () =>{
            this.initMap();
            this.enemyWay = component.getEnemyWay();
            this.activePos = component.getActivePos();
        });
    }
    private addLoad(LV : number, callFn : () => void) : void{
        const icons :  string[] = [];
        ["", 2, 3, 4].forEach((item) => {
            icons.push("Map/mapicon" + item)
        });
        icons.push("Map/level" + LV + "_mapicon");
        ResourcesLoader.addGroup("地图资源",[
            {
                url : "Map/gamelevel1_" + LV,
                type : TiledMapAsset,
                success : (resource) => {
                    this.tmxAsset = resource;
                }
            },
            {
                url : icons,
                type : cc.SpriteAtlas,
                success: (resource) => {
                    this.mapIcons = resource;
                },
                fail : (error) => {
                    cc.log(error);
                }
            },
            {
                url : "Data/Map/" + LV,
                fail : (error) => {
                    cc.log(error);
                    return false;
                }
            }
        ], () => {
            callFn();
        });
    }
    private initMap() : void{
        const stageData = this.gameBase.getDataBase().getStageData();
        const towerData = this.gameBase.getDataBase().getAllTowerData();
        const towers : Array<{id: string, cast : number}> = [];
        for(let tower of stageData.towers){
            towers.push({id : tower, cast : towerData.get(TowerTypeMap.get(tower)).detail[0].cast})
        }
        this._component.initialize(this.tmxAsset, this.mapIcons, {towers, money : stageData.money, createTower : this.createTower, successBuild : this.successBuild});
    }
    public getEnemyWayItem(id : number, index : number) : cc.Vec2{
        return this.enemyWay[id].root[index] || null;
    }
    public putCharacter(character : Character) : void{
        this._component.node.addChild(character.node,0, character.uniqueId);
    }
    public removeCharacter(character : Character): void{
        this._component.node.removeChildByTag(character.uniqueId);
    }
    public createTower = (towerId : string, pos : cc.Vec2) : Tower => {
        const tower = this.gameBase.getTowerFactory().createTower(TowerTypeMap.get(towerId));
        this.towerMap.set(pos, tower);
        return tower;
    };
    public removeTower = (pos : cc.Vec2) : void => {
        this.towerMap.delete(pos);
    };
    public upgrade(pos : cc.Vec2) : void{
        this.towerMap.get(pos).upgrade();
    }
    private successBuild = (tower : Tower) : number => {
        const informationSystem = this.gameBase.getInformationSystem();
        informationSystem.changeMoney(- tower.attribute.cast);
        return informationSystem.getMoney();
    };
    public getMapTiledSize() : cc.Size{
        return this._component.mapTiledSize;
    }
    public addRevivalItem(pos : cc.Vec2) : void{
        this.component.addRevivalItem(pos);
    }
}