import TiledMapAsset = cc.TiledMapAsset;
import TowerPanel from "../UI/TowerPanel";
import Tower from "../Tower/Tower";
import BaseTowerComponent, {default as BaseTowerComponent} from "./BaseTowerComponent";
import Global from "../Common/Global";
import MapSearchPoint from "../Map/MapSearchPoint";
import MapSearch from "../Map/MapSearch";

const {ccclass, property} = cc._decorator;
interface MapObject{
    name : string;
    offset : {
        x : number;
        y : number;
    }
}
enum TiledTag{
    TOWER,
    CHARACTER,
    NONE
}
export interface MapComponentParameter{
    towers : Array<{id: string, cast : number}>;
    money : number;
    createTower : (towerId : string, pos : cc.Vec2) => Tower;
    successBuild : (tower : Tower) => number;
}
export interface Way{
    id : number;
    root : Array<cc.Vec2>;
}
@ccclass
export default class MapComponent extends cc.Component {
    get mapTiledSize(): cc.Size {
        return this._mapTiledSize;
    }
    private tiledMap : cc.TiledMap;
    private ground : cc.TiledLayer;
    private allowWalks : Array<boolean[]>;
    private triggerOnMap : Array<cc.Vec2>;
    private mapTiledMap : Map<number, cc.Node>;

    @property({
        type : cc.Prefab,
        default : null
    })
    private triggerPrefab : cc.Prefab;

    private triggerContainer : cc.Node;

    private _isInitTouchEvent : boolean = false;

    private mapSize : cc.Size;
    private _mapTiledSize : cc.Size;

    @property({
        type : TowerPanel,
        default : null
    })
    private towerPanel : TowerPanel;
    private createTower : (towerId : string, pos : cc.Vec2) => Tower;
    private successBuildCallMapSystem : (tower : Tower) => number;

    @property({
        type : cc.Node,
        default : null
    })
    private upgrade : cc.Node;

    @property({
        type : cc.Label,
        default : null
    })
    private upgradeLabel : cc.Label;

    @property({
        type : cc.Node,
        default : null
    })
    private sell : cc.Node;

    @property({
        type : cc.Label,
        default : null
    })
    private sellLabel : cc.Label;

    @property({
        type : cc.Node,
        default : null
    })
    private topPoint : cc.Node;

    private currentTower : BaseTowerComponent;
    private currentPos : cc.Vec2;


    private revivalItemPrefab : cc.Prefab;
    private ways : Way[];
    public onLoad(): void {
        this.tiledMap = this.node.addComponent(cc.TiledMap);
    }
    private  getIndex(pos : {x : number, y : number}) : number{
        return pos.x * 10 + pos.y;
    }
    public initialize(tmxAsset : TiledMapAsset, mapIcons : cc.SpriteAtlas[], parameter : MapComponentParameter) : void{
        this.tiledMap.tmxAsset = tmxAsset;
        this.createTower = parameter.createTower;
        this.successBuildCallMapSystem = parameter.successBuild;
        this.mapSize = this.tiledMap.getMapSize();
        const objectGroup = this.tiledMap.getObjectGroup("Objects");
        this.addMapIcon(objectGroup.getObjects(), mapIcons);
        this.initTouch();
        this.initTiled();


        this.initWay(objectGroup.getObject("end"));
        this.initTrigger();
        this.node.on("touchstart",this.onTouch, this);
        this.towerPanel.initialize(parameter.towers, parameter.money, this.setTriggerContainerActive);
        this.setTowerToolActive(false);
    }
    private initTouch() : void{
        this.sell.on("touchstart", () => {
            this.currentTower.tower.sell();
            this.setTowerToolActive(false);
            this.topPoint.active = false;
            const node = cc.instantiate(this.triggerPrefab);
            node.setPosition(this.posOnMapConvertToPosOnNode(this.currentPos));
            this.mapTiledMap.set(this.getIndex(this.currentPos), node);
            this.triggerContainer.addChild(node);
        });

        this.upgrade.on("touchstart", () => {
            if(this.currentTower.tower.canUpgrade()){
                this.currentTower.tower.upgrade();
            }
        });
    }
    private onTouch = (event : cc.Event.EventTouch) : void => {
        const touchPos = this.node.convertToNodeSpace(event.getLocation());
        const x = Math.floor(touchPos.x / this._mapTiledSize.width);
        const y = this.mapSize.height - Math.floor(touchPos.y / this._mapTiledSize.height) - 1;
        const index = this.getIndex({x, y});
        const item = this.mapTiledMap.get(index);
        if(item == null){
            this.towerPanel.cancelCommend();
            return;
        }
        this.currentTower = null;
        this.setTowerToolActive(false);
        this.topPoint.active = false;
        switch(item.tag){
            case TiledTag.NONE:
                this.putTower(new cc.Vec2(x,y), item);
                break;
            case TiledTag.TOWER:
                this.currentTower = item.getComponent<BaseTowerComponent>(BaseTowerComponent);
                this.currentPos = new cc.Vec2(x, y);
                this.setTowerToolActive(true);
                this.showTopPoint();
                break;
            case TiledTag.CHARACTER:
                break;
        }

    };
    private showTopPoint() : void{
        const pos = this.currentTower.node.getPosition();
        const tiledSize = this.mapTiledSize;
        this.topPoint.active = true;
        this.topPoint.setPosition(pos.x, pos.y + tiledSize.height);
    }
    private setTowerToolActive(bool : boolean) : void{
        if(bool){
            const tower = this.currentTower;
            const pos = tower.node.getPosition();
            const tiledSize = this.mapTiledSize;
            const y = pos.y + tiledSize.height * 2;
            this.sell.setPosition(new cc.Vec2(pos.x - tiledSize.width, y));
            this.upgrade.setPosition(new cc.Vec2(pos.x + tiledSize.width, y));
            this.sellLabel.string = tower.tower.getSellMoney() + "";
            this.upgradeLabel.string = tower.tower.getUpgradeCast() + "";


            this.sell.active = true;
            this.upgrade.active = this.currentTower.tower.canUpgrade();
        }else{
            this.sell.active = false;
            this.upgrade.active = false;
        }
    }
    private putTower(pos : cc.Vec2, item : cc.Node) : void{
        item.removeFromParent();
        const towerId = this.towerPanel.currentBuildTowerId;
        const tower = this.createTower(towerId, pos);
        const node = tower.node;
        node.tag = TiledTag.TOWER;
        node.setPosition(this.posOnMapConvertToPosOnNode(pos));
        this.node.addChild(node, 0, TiledTag.TOWER);
        this.mapTiledMap.set(this.getIndex(pos), node);
        this.successBuild(tower);
    }
    private removeTower(pos : cc.Vec2){
        const node = this.mapTiledMap.get(this.getIndex(pos));
        node.removeFromParent();

        const trigger = cc.instantiate(this.triggerPrefab);
        trigger.tag = TiledTag.NONE;
        this.triggerContainer.addChild(trigger);
        this.mapTiledMap.set(this.getIndex(pos), trigger);
    }
    private addMapIcon(objects : MapObject[],mapIcons : cc.SpriteAtlas[]){
        const container = new cc.Node("iconContainer");
        this.node.addChild(container);
        objects.forEach((object) => {
            const node = new cc.Node();
            node.setPosition(object.offset);
            container.addChild(node);

            const sprite = node.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            sprite.spriteFrame = this.getSpriteFrame(this.getSpriteFrameName(object.name), mapIcons);
        });
    }
    private getSpriteFrameName(rawName : string) : string{
        let result = "";
        for(let i = 0, l =  rawName.length; i < l; i++){
            if(rawName[i] == ".") break;
            result += rawName[i];
        }
        return result;
    }
    private initTiled(){
        const ground = this.tiledMap.getLayer("Background");
        const size = ground.getLayerSize();
        const way : Array<boolean[]> = [];
        const trigger : Array<cc.Vec2> = [];
        for(let i = 0; i < size.width; i++){
            const row : boolean[] = [];
            for(let j = 0; j < size.height; j++){
                const properties = this.tiledMap.getPropertiesForGID(ground.getTileGIDAt(i, j));
                if(typeof properties != "object" || !properties.hasOwnProperty("tiletype")){
                    row.push(false);
                    continue;
                }
                const tileType = properties["tiletype"];
                if(tileType == "1"){
                    trigger.push(cc.p(i, j));
                }
                row.push(tileType == "0");
            }
            way.push(row);
        }
        this.ground = ground;
        this._mapTiledSize = ground.getMapTileSize();
        this.allowWalks = way;
        this.triggerOnMap = trigger;
    }
    private initWay(endObject){
        const startObjectGroup = this.tiledMap.getObjectGroup("starts");
        const mapSearch = new MapSearch(this.mapSize, this.allowWalks);
        if(startObjectGroup == null){
            throw new Error("Starts must be in tiledAsset, please fix it");
        }
        const starts = startObjectGroup.getObjects();
        const end = this.convertObjectPosToMapPos(endObject.offset);
        if(this.allowWalk(end) === false){
            throw new Error("End point is not allow walk, please fix it.");
        }
        const roots : Array<Way> = [];
        let i = 0;
        for(let item of starts){
            const pos = this.convertObjectPosToMapPos(item.offset);
            if(this.allowWalk(pos) === false){
                throw new Error("Start point is not allow walk, please fix it.");
            }
            roots.push({
                id : i++,
                root : mapSearch.search(pos, end).reverse()
            });
        }
        this.ways = roots;
    }
    private convertObjectPosToMapPos(pos : {x : number, y : number}) : cc.Vec2{
        const x = Math.floor(pos.x / this._mapTiledSize.width);
        const y = Math.floor(pos.y / this._mapTiledSize.height);
        return new cc.Vec2(x, y);
    }
    private allowWalk(pos : cc.Vec2) : boolean{
        return this.allowWalks[pos.x][pos.y];
    }
    private initTrigger() : void{
        const containerNode = new cc.Node("triggerContainer");
        this.node.addChild(containerNode, 100);

        const triggerNodeMap : Map<number, cc.Node> = new Map<number, cc.Node>();
        const posOnMap = this.triggerOnMap;
        const posOnNode = this.posOnMapsConvertToPosOnNode(posOnMap);
        for(let i = 0, l = posOnMap.length;i < l; i++){
            const node = cc.instantiate(this.triggerPrefab);
            node.setPosition(posOnNode[i]);
            containerNode.addChild(node, 0, TiledTag.NONE);
            triggerNodeMap.set(this.getIndex(posOnMap[i]), node);
        }

        containerNode.active = false;

        this.mapTiledMap = triggerNodeMap;
        this.triggerContainer = containerNode;
    }
    public initTouchEvent(callFn : (pos : cc.Vec2) => void) : void{
        if(this._isInitTouchEvent) return;
        this._isInitTouchEvent = true;
    }
    public setTriggerContainerActive = (bool : boolean) : void => {
        this.triggerContainer.active = bool;
    };
    public setTriggerActive(pos : cc.Vec2, bool : boolean){
        this.mapTiledMap.get(this.getIndex(pos)).active = bool;
    }
    public getEnemyWay() : Way[]{
        const ways =  this.ways;
        for(let item of ways){
            item.root = this.posOnMapsConvertToPosOnNode(item.root);
        }
        return ways;
    }
    public getActivePos() : cc.Vec2[]{
        return this.triggerOnMap;
    }
    private posOnMapConvertToPosOnNode(pos : cc.Vec2) : cc.Vec2{
        return this.posOnMapsConvertToPosOnNode([pos])[0];
    }
    private posOnMapsConvertToPosOnNode(pos : cc.Vec2[]) : cc.Vec2[]{
        const result : Array<cc.Vec2> = [];
        const mapSize = this.tiledMap.getMapSize();
        const tiledSize = this.ground.getMapTileSize();
        const nodeSize = this.node.getContentSize();
        const anchor = this.node.getAnchorPoint();
        for(let item of pos){
            const x = item.x * tiledSize.width + tiledSize.width / 2 - nodeSize.width * anchor.x;
            const y = (mapSize.height - item.y - 1) * tiledSize.height + tiledSize.height / 2 - nodeSize.height * anchor.y;
            result.push(new cc.Vec2(x, y));
        }
        return result;
    }
    private getSpriteFrame(key : string, atlas : cc.SpriteAtlas[]) : cc.SpriteFrame{
        let result;
        for(let item of atlas){
            result = item.getSpriteFrame(key);
            if(result != null){
                break;
            }
        }
        return result;
    }
    private successBuild(tower : Tower) : void{
        const money = this.successBuildCallMapSystem(tower);
        this.towerPanel.successBuild(money);
    }
    public addRevivalItem(pos : cc.Vec2) : void{
        const node = cc.instantiate(this.revivalItemPrefab);
        node.setPosition(pos);
        this.node.addChild(node);
    }
}