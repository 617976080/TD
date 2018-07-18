import Enemy from "../Character/Enemy";
import Global from "../../Common/Global";

export const enum EnemyState{
    FROZEN = "frozen",
    DIZZINESS = "dizziness"
}
export const enum EnemyStateAnimation{
    ON_STATE = "on",
    END_STATE = "end",
}
export const EnemyStateAnimationMap = new Map<string, EnemyStateAnimation>(
    [
        ["on", EnemyStateAnimation.ON_STATE],
        ["end", EnemyStateAnimation.END_STATE]
    ]
);
export default abstract class EnemyStateAbstract {
    protected abstract getId() : string;
    protected enemy : Enemy;
    private elapsed = 0;
    private duration : number;
    private onStateClip : string;
    private exitStateClip : string;
    constructor(dt : number, enemy : Enemy){
        this.enemy = enemy;
        this.duration = dt;
        const animationManager= Global.getGameBase().getAnimationManager();
        const res = animationManager.getAnimationGroupRes<EnemyStateAnimation>(this.getId());
        const component = enemy.baseComponent;

        const onStateRes = res.get(EnemyStateAnimation.ON_STATE);
        if(onStateRes){
            const name = this.getId() + EnemyStateAnimation.ON_STATE;
            component.createAnimationClip(onStateRes, name);
            this.onStateClip = name;
        }

        const endStateRes = res.get(EnemyStateAnimation.END_STATE);
        if(endStateRes){
            const name = this.getId() + EnemyStateAnimation.END_STATE;
            component.createAnimationClip(endStateRes, name);
            this.exitStateClip = name;
        }
    }
    public onState() : void{
        if(this.onStateClip){
            const component = this.enemy.baseComponent;
            component.playAnimation(this.getId() + EnemyStateAnimation.ON_STATE);
        }
        this.onStateChange();
    }
    protected abstract onStateChange() : void
    public update(dt : number) : void{
        if(( this.elapsed += dt ) > this.duration){
            this.endState();
        }
    }
    public endState() : void{
        if(this.onStateClip){
            const component = this.enemy.baseComponent;
            component.playAnimation(this.getId() + EnemyStateAnimation.END_STATE);
        }
        this.endStateRecover();
    }
    protected abstract endStateRecover() : void
    public addSecond(dt : number){
        this.duration += dt;
    }
}