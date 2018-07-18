const {ccclass, property} = cc._decorator;
@ccclass
export default class NewComponent extends cc.Component {
    public onLoad(): void {
    }
    public play() : void{
        cc.director.loadScene("Game");
    }
}