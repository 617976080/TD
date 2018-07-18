const {ccclass, property} = cc._decorator;
@ccclass
export default class GameOver extends cc.Component {
    @property({
        type : cc.Node,
        default : null
    })
    private winTitle : cc.Node;

    @property({
        type : cc.Node,
        default : null
    })
    private failTitle : cc.Node;

    @property({
        type : cc.Node,
        default : null
    })
    private exitButton : cc.Node;

    @property({
        type : cc.Node,
        default : null
    })
    private nextButton : cc.Node;
    public onLoad(): void {
        this.node.active = false;
        this.node.on("touchstart", (event) => {
            event.stopPropagation();
        });
        this.winTitle.active = false;
        this.failTitle.active = false;
        this.nextButton.active = false;
        let onExit = false;
        this.exitButton.on("touchstart", () => {
            if(onExit) return;
            cc.director.loadScene("Launch");
            onExit = true;
        });
        this.nextButton.on("touchstart", () =>{
           cc.director.loadScene("Game");
        });
    }
    public show(isWin : boolean) : void{
        this.node.active = true;
        if(isWin){
            this.winTitle.active = true;
            this.nextButton.active = true;
        }else{
            this.failTitle.active = true;
        }

    }
}