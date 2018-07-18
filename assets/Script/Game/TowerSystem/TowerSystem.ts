import GameSystem from "../../GameSystem";
import ResourcesLoader from "../Common/ResourcesLoader";
import {TowerIdMap} from "../Factory/TowerFactory";
import Tower from "../Tower/Tower";
const SELL_ANIMATION_ID : string = "sellsmoke";
export default class TowerSystem extends GameSystem {
    private tower : Tower[] = [];
    public constructor(gameBase : any){
        super(gameBase);
        this.initialize();
    }
    private initialize() : void{
        this.addLoad();
    }
    private addSellSmoke() : void{
        const manager = this.gameBase.getAnimationManager();
        const atlas = this.gameBase.gameUISpriteAtlas;
        const spriteFrames : cc.SpriteFrame[] = [];
        for(let i = 1; i < 1000; i++){
            const item = atlas.getSpriteFrame(SELL_ANIMATION_ID + i);
            if(item == null){
                break;
            }
            spriteFrames.push(item);
        }
        manager.addAnimationRes(SELL_ANIMATION_ID, spriteFrames);
    }
    private addLoad() : void{
        const data = this.gameBase.getDataBase().getAllTowerData();
        const factory = this.gameBase.getTowerFactory();
        const loadItems = [];
        data.forEach((value, key) => {
            const id = TowerIdMap.get(key);
            loadItems.push({
                url : "Tower/" + id,
                type : cc.SpriteAtlas,
                success : (resource, id) =>{
                    factory.initAnimationRes([resource], id);
                },
                data : id
            });
        });
        ResourcesLoader.addGroup("建筑资源",loadItems);
    }
    public addTower(tower : Tower) : void{
        this.tower.push(tower);
    }
    public removeTower(tower : Tower) : void{
        this.tower.splice(this.tower.indexOf(tower), 1);
    }
    public update(dt : number) : void{
        this.tower.forEach((tower) => {
            tower.update(dt);
        });
    }
}