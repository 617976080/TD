import property = cc._decorator.property;
const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuItem extends cc.Component {
    @property(cc.Label)
    private label : cc.Label;
    init(text : string, event : cc.Component.EventHandler){
        this.label.string = text;
        this.node.on('touchstart', function(){
            event.emit(null);
        });
    }
}
