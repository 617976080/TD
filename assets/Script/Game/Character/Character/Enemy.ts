import Character, {CharacterAnimation} from "./Character";
import EnemyAttr from "../Attr/EnemyAttr";
import Global from "../../Common/Global";
import {EnemyState} from "../Attr/EnemyState";
const enum Direction{
    UP,RIGHT,DOWN,LEFT
}
interface AttackParameter{
    PA? : number;
    weakSpeedSecond ? : number;
}
export default abstract class Enemy extends Character<EnemyAttr>{
    set wayId(value: number) {
        this._wayId = value;
    }
    get wayIndex(): number {
        return this._wayIndex;
    }
    private _wayIndex : number;
    private destination : cc.Vec2;
    private static gameBase : any = null;
    private currDirection : Direction;
    private _isArriveEnd : boolean;
    private _isDead : boolean = false;
    public static setMapSystem(gamBase) : void {
        Enemy.gameBase = gamBase;
    }
    protected constructor(){
        super();
    }
    get gameBase(){
        return Enemy.gameBase;
    }
    public initialize(): void {
        const mapSystem = Enemy.gameBase.getMapSystem();
        this._wayIndex = 0;
        this.destination = mapSystem.getEnemyWayItem(this._wayId,1);
        this.changeDirection(mapSystem.getEnemyWayItem(this._wayId,0), mapSystem.getEnemyWayItem(this._wayId,1));
        //this.currDirection = Enemy.getDirection(mapSystem.getEnemyWayItem(0), this.destination);
    }
    private _wayId : number;
    private enemyType : any;
    public setCharacterType(param: any): void {
        this.enemyType = param;
    }
    public getCharacterType(): string {
        return this.enemyType;
    }
    public update(dt: number): void {
        if(this._isArriveEnd === true){
            return;
        }
        this._characterAttr.update(dt);

        const pos = this.node.getPosition();
        let x = pos.x;
        let y = pos.y;
        const delta = this._characterAttr.moveSpeed * dt;
        const destination = this.destination;
        switch(this.currDirection){
            case Direction.LEFT:
                x -= delta;
                if(x < destination.x){
                    return this.boundUpdate(dt);
                }
                break;
            case Direction.RIGHT:
                x += delta;
                if(x > destination.x){
                    return this.boundUpdate(dt);
                }
                break;
            case Direction.UP:
                y += delta;
                if(y > destination.y){
                    return this.boundUpdate(dt);
                }
                break;
            case Direction.DOWN:
                y -= delta;
                if(y < destination.y){
                    return this.boundUpdate(dt);
                }
                break;
        }
        this.node.setPosition(x, y);
    }
    private changeDirection(start : cc.Vec2 , end : cc.Vec2) : void{
        let direction : Direction;
        if(start.x == end.x){
            direction =  end.y > start.y ? Direction.UP : Direction.DOWN;
        }else if(start.y == end.y){
            direction =  end.x > start.x ? Direction.RIGHT : Direction.LEFT;
        }else{
            throw new Error("Direction is error");
        }
        let characterAnimation : CharacterAnimation;
        switch(direction){
            case Direction.LEFT:
                characterAnimation = CharacterAnimation.WALK_LEFT;
                break;
            case Direction.RIGHT:
                characterAnimation = CharacterAnimation.WALK_RIGHT;
                break;
            case Direction.UP:
                characterAnimation = CharacterAnimation.WALK_UP;
                break;
            case Direction.DOWN:
                characterAnimation = CharacterAnimation.WALK_DOWN;
                break;
        }
        this.playAnimation(characterAnimation);
        this.currDirection = direction;
    }
    private boundUpdate(dt : number) : void{
        const pos = this.node.getPosition();
        const destination = this.destination;
        let deltaDistance : number;
        if(this.currDirection == Direction.LEFT || this.currDirection == Direction.RIGHT){
            deltaDistance = Math.abs(pos.x - destination.x);
        }else{
            deltaDistance = Math.abs(pos.y - destination.y)
        }
        this.node.setPosition(destination);
        const nextDestination = Enemy.gameBase.getMapSystem().getEnemyWayItem(this._wayId,++this._wayIndex);
        if(nextDestination == null){
            this.arriveEnd();
            return;
        }
        this.changeDirection(destination, nextDestination);
        //this.currDirection = Enemy.getDirection(this.destination, nextDestination);
        this.destination = nextDestination;
        this.gameBase.getCharacterManager().updateEnemySort();
        this.update(dt - deltaDistance / this._characterAttr.moveSpeed);
    }
    private arriveEnd() : void{
        this.gameBase.getInformationSystem().enemyArriveEnd(1);
        this.gameBase.getCharacterManager().removeEnemy(this);
        this._isArriveEnd = true;
        cc.log("Enemy arrive end.");
    }
    public isArriveEnd() : boolean{
        return this._isArriveEnd;
    }
    private playAnimation(animation : CharacterAnimation){
        this._baseComponent.playAnimation(animation);
    }
    public attack(parameter : AttackParameter) : void{
        const PA = parameter.PA || 0;
        const weakSpeedSecond = parameter.weakSpeedSecond || 0;

        if(PA > 0){
            this.handelPA(PA);
        }

        if(weakSpeedSecond > 0){
            this.handelWeak(weakSpeedSecond,EnemyState.FROZEN);
        }
    }
    private handelPA(PA : number){
        const attr = this._characterAttr;
        const delta = PA - attr.PD;
        if(delta < 0) return;
        this.setHP(attr.HP - delta);
        if(attr.HP < 0) this.dead();
    }
    private handelWeak(second : number, state : EnemyState) : void{
        this._characterAttr.addBuff(second, state);
    }
    private dead() : void{
        this.gameBase.getCharacterManager().removeEnemy(this);
        this.gameBase.getInformationSystem().changeMoney(this._characterAttr.reward);
        //this.gameBase.getMapSystem().addRevivalItem(this.node.getPosition());
        this._isDead = true;
    }
    public isDead() : boolean{
        return this._isDead;
    }
}