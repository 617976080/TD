import TowerPanelItem from "./TowerPanelItem";

const {ccclass, property} = cc._decorator;
@ccclass
export default class TowerPanel extends cc.Component {
    get currentBuildTowerId(): string {
        return this._currentBuildTowerId;
    }
    @property({
        type : cc.SpriteAtlas,
        default : null
    })
    private icons : cc.SpriteAtlas;

    @property({
        type : cc.Prefab,
        default : null
    })
    private towerPanelItemPrefab : cc.Prefab;

    private towerIcons = new Map<string, TowerPanelItem>();
    private _currentBuildTowerId : string = null;

    @property({
        type : cc.Node,
        default : null
    })
    private checkBtn : cc.Node;
    private setTirggerActive : (bool : boolean) => void;

    @property({
        type : cc.Node,
        default : null
    })
    private iconContainer : cc.Node;
    public onLoad() : void{
        this.checkBtn.active = false;
        this.node.on("touchstart",() => {this.cancelCommend()});
    }
    public initialize(towers : Array<{id: string, cast : number}>, currentMoney : number, setTriggerActive : (bool : boolean) => void) : void{
        const prefab = this.towerPanelItemPrefab;
        const atlas = this.icons;
        this.setTirggerActive = setTriggerActive;

        for(let tower of towers){
            const node = cc.instantiate(prefab);
            const id = tower.id;
            const component = node.getComponent<TowerPanelItem>(TowerPanelItem);
            const normalSpriteFrame = atlas.getSpriteFrame(id + "_n");
            const disableSpriteFrame = atlas.getSpriteFrame(id + "_s");
            if(normalSpriteFrame == null){
                throw new Error(id + "_n" + "is not in atlas");
            }
            if(disableSpriteFrame == null){
                throw new Error(id + "_s" + "is not in atlas");
            }
            component.init(normalSpriteFrame, disableSpriteFrame, tower.cast, currentMoney);
            node.on("touchstart", this.getTouchEvent(id));
            this.iconContainer.addChild(node);
            this.towerIcons.set(id, component);
        }
    }
    private getTouchEvent(id : string){
        return (event : cc.Event) => {
            const component = this.towerIcons.get(id);
            if(component.isDisable) return;
            this._currentBuildTowerId = id;
            this.setTirggerActive(true);
            this.checkBtn.setPosition(component.node.getPosition());
            this.checkBtn.setContentSize(component.node.getContentSize());
            this.checkBtn.active = true;
            event.stopPropagation();
        }
    }
    public updateData(currentMoney : number) : void{
        this.towerIcons.forEach(value => {
            value.updateData(currentMoney);
        });
    }
    public cancelCommend() : void{
        this._currentBuildTowerId = null;
        this.checkBtn.active = false;
        this.setTirggerActive(false);
    }
    public successBuild(currentMoney : number) : void{
        this.cancelCommend();
        this.updateData(currentMoney);
    }
}