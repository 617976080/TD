import MenuItem from "./MenuItem";
const {ccclass, property} = cc._decorator;
@ccclass
class SMenuItem extends cc.Class{
    @property(cc.String)
    public text = "";
    @property(cc.Component.EventHandler)
    public event : cc.Component.EventHandler = null;
}
@ccclass
export default class Menu extends cc.Component {
    @property([SMenuItem])
    private items : SMenuItem[] = [];

    @property(cc.Prefab)
    private itemPrefab : cc.Prefab;
    onLoad() {
        for(let menuItem : SMenuItem of this.items){
            let node = cc.instantiate(this.itemPrefab);
            let component : MenuItem = node.getComponent("MenuItem");
            component.init(menuItem.text, menuItem.event);
            this.node.addChild(node);
        }
    }
}
