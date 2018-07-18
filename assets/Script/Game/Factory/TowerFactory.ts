import Tower, {TowerAnimation, TowerAnimationMap} from "../Tower/Tower";
import GameSystem from "../../GameSystem";
import BaseTowerComponent from "../Component/BaseTowerComponent";

export enum TowerType{
    ICE_TOWER,
    WIND_TOWER
}
export const TowerTypeMap = new Map<string, TowerType>([
    ["iceTower", TowerType.ICE_TOWER],
    ["windTower", TowerType.WIND_TOWER]
]);
export const TowerIdMap = new Map<TowerType, string>();
(function(){
    TowerTypeMap.forEach((value, key) => {
        TowerIdMap.set(value, key);
    });
})();
export default class TowerFactory extends GameSystem{
    private towerPrefab : cc.Prefab;
    private mapNode : cc.Node;
    public constructor(gameBase : any, towerPrefab : cc.Prefab){
        super(gameBase);
        this.towerPrefab = towerPrefab;
    }
    public initAnimationRes(resources : cc.SpriteAtlas[], towerId : string){
        this.gameBase.getAnimationManager().addAnimationGroupRes<TowerAnimation>(resources, towerId, TowerAnimationMap);
    }
    private getMapNode() : cc.Node{
        if(this.mapNode) return this.mapNode;
        return this.mapNode = this.gameBase.getMapSystem().component.node;
    }
    public createTower(towerType : TowerType) : Tower{
        const tower = new Tower();
        const node = cc.instantiate(this.towerPrefab);
        const data = this.gameBase.getDataBase().getTowerData(towerType);
        const component : BaseTowerComponent = node.getComponent("BaseTowerComponent");
        const towerId = TowerIdMap.get(towerType);
        const animationRes = this.gameBase.getCharacterFactory().getAnimationRes<TowerAnimation>(towerId);

        component.initialize(this.getMapNode(), tower);

        animationRes.forEach((spriteFrames , clipName : any) => {
            component.createAnimationClip(spriteFrames, clipName);
        });
        component.initSpriteFrame(animationRes.get(TowerAnimation.ATTACK_DOWN)[0]);

        tower.component = component;
        tower.name = data.name;
        tower.attributes = data.detail;
        tower.id = data.id;
        tower.node = node;
        tower.spinSpriteFrames = animationRes.get(TowerAnimation.SPIN);
        tower.initialize();
        this.gameBase.getTowerSystem().addTower(tower);
        return tower;
    }
}