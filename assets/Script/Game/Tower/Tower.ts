import {TowerDetailItem} from "../DataBase/TowerDataParse";
import BaseTowerComponent from "../Component/BaseTowerComponent";
import Global from "../Common/Global";
import Enemy from "../Character/Character/Enemy";
import CharacterManager from "../Manager/CharacterManager";
import {EnemyState} from "../Character/Attr/EnemyState";
export enum TowerAnimation{
    ATTACK_UP = "attack_up",
    ATTACK_DOWN = "attack_down",
    ATTACK_RIGHT = "attack_right",
    ATTACK_LEFT = "attack_left",
    ATTACK_LOCUS = "attack_locus",
    EFFECT = "effect",
    SPIN = "spin",
}
export const TowerAnimationMap = new Map<string, TowerAnimation>([
    ["attack_up", TowerAnimation.ATTACK_UP],
    ["attack_right", TowerAnimation.ATTACK_RIGHT],
    ["attack_down", TowerAnimation.ATTACK_DOWN],
    ["attack_left", TowerAnimation.ATTACK_LEFT],
    ["attack_locus", TowerAnimation.ATTACK_LOCUS],
    ["effect", TowerAnimation.EFFECT],
    ["spin", TowerAnimation.SPIN]
]);
enum AttackMethod{
    ATTACK_ONE,
    ATTACK_ALL
}
enum Direction{
    UP,
    RIGHT,
    DOWN,
    LEFT
}
const lengthEveryDirection = 6;
const directionClockwise = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];
export const TowerExample = 12;
export default abstract class Tower {
    set spinSpriteFrames(value: cc.SpriteFrame[]) {
        this._spinSpriteFrames = value;
    }
    get attribute(): TowerDetailItem {
        return this._attribute;
    }
    private _attributes : TowerDetailItem[];
    private LV : number;
    private _attribute : TowerDetailItem;
    private _component : BaseTowerComponent;
    private _name : string;
    private _id : string;
    private elapsed : number = 0;
    public node : cc.Node;
    private prevTarget : Enemy;
    private attackMethod : AttackMethod;
    private currentDirection = Direction;
    private _spinSpriteFrames : cc.SpriteFrame[];


    public constructor() {
        this.currentDirection = Direction.DOWN;
    }
    get gameBase() : void{
        return Global.getGameBase();
    }
    set attributes(value : TowerDetailItem[]){
        this._attributes = value;
    }
    set component(value: BaseTowerComponent) {
        this._component = value;
    }
    set name(value : string){
        this._name = value;
    }
    set id(value : string){
        this._id = value;
    }
    public hasNextLV() : boolean{
        return this.LV <= this._attributes.length;
    }
    public getUpgradeCast () : number{
        return this._attributes[this.LV].cast;
    }
    public upgrade() : boolean{
        if(!this.hasNextLV()) return false;
        this.setAttribute(++this.LV);
        this._component.setLV(this.LV, this._attributes[this.LV - 1]);
        return true;
    }
    public initialize() : void{
        this.initLV();

    }
    private initLV() : void{
        const defaultLV = 1;
        this.LV = defaultLV;
        this.setAttribute(defaultLV);
        this._component.setLV(this.LV, this._attributes[defaultLV]);
    }
    private setAttribute(LV : number){
        const attribute = this._attributes[LV - 1];
        this.attackMethod = attribute.PA == 0 ? AttackMethod.ATTACK_ALL : AttackMethod.ATTACK_ONE;
        this._attribute = attribute;
    }
    public update(dt : number) : void{
        this.elapsed += dt;
        const attr = this._attribute;
        if(this.elapsed > attr.attackInterval) {
            this.elapsed -= attr.attackInterval;
            this.attack();
        }
    }
    public getSellMoney() : number{
        let result = 0;
        for(let i = 0, l = this.LV; i < l; i++){
            result += this._attributes[i].cast;
        }
        return result;
    }
    public sell = () : void =>{
        const sellMoney = this.getSellMoney();
        this._attributes = null;
        this._component = null;
        this._attribute = null;
        this.prevTarget = null;
        this.node.removeFromParent();
        this.node = null;
        this.gameBase.getTowerSystem().removeTower(this);
        this.gameBase.getInformationSystem().changeMoney(sellMoney);
    };
    public canUpgrade() : boolean{
        return this.LV < this._attributes.length;
    };
    private attack() : void{
        const manager = Global.getGameBase().getCharacterManager();
        const attribute = this._attribute;
        const towerPos = this.node.getPosition();
        const centerEnemy = this.getCenterEnemy(manager, towerPos);
        if(centerEnemy == null || this.turnTower(centerEnemy, towerPos)) return;
        const centerEnemyPos = centerEnemy.node.getPosition();
        let animationClip : TowerAnimation;
        switch(this.currentDirection){
            case Direction.UP:
                animationClip = TowerAnimation.ATTACK_UP;
                break;
            case Direction.RIGHT:
                animationClip = TowerAnimation.ATTACK_RIGHT;
                break;
            case Direction.DOWN:
                animationClip = TowerAnimation.ATTACK_DOWN;
                break;
            case Direction.LEFT:
                animationClip = TowerAnimation.ATTACK_LEFT;
                break;
        }
        this._component.playLocusAndEffect(towerPos, centerEnemyPos);
        this._component.playAnimation(animationClip);
        let enemy : Enemy[] = [];
        if(attribute.spawnAttack){
            enemy = manager.getEnemyAtRange(centerEnemyPos, 1);
        }else{
            enemy.push(centerEnemy);
        }
        enemy.forEach(value => {
            value.attack({PA : attribute.PA, weakSpeedSecond : attribute.weakSpeedSecond});
        });
    }
    private getCenterEnemy(manager : CharacterManager, towerPos : cc.Vec2) : Enemy{
        const attribute = this._attribute;
        let centerEnemy : Enemy;
        if(this.prevTarget &&
                !this.prevTarget.isDead() &&
            this.attackMethod == AttackMethod.ATTACK_ONE &&
            manager.enemyAtRange(towerPos,this.prevTarget, this.attribute.range)){
            centerEnemy = this.prevTarget;
        }else{
            const filterFn = this.attackMethod == AttackMethod.ATTACK_ONE ? null : (enemy : Enemy) : boolean => {
                return enemy.characterAttr.hasBuff(EnemyState.FROZEN);
            };
            centerEnemy = manager.getOneEnemyAtRange(towerPos, attribute.range, filterFn);
        }
        return this.prevTarget = centerEnemy;
    }
    private turnTower( centerEnemy : Enemy, towerPos : cc.Vec2) : boolean{
        const enemyPos = centerEnemy.node.getPosition();
        const angle = cc.pAngle(towerPos, enemyPos);
        const angle2 = angle > 1.57 ? 3.14 - angle : angle;
        const atlas = this._spinSpriteFrames;
        let possibleDirection = [];
        if(enemyPos.y > towerPos.y){
            if(enemyPos.x > towerPos.x){
                possibleDirection = [Direction.UP, Direction.RIGHT];
            }else{
                possibleDirection = [Direction.UP, Direction.LEFT];
            }
        }else{
            if(enemyPos.x > towerPos.x){
                possibleDirection = [Direction.DOWN, Direction.RIGHT];
            }else{
                possibleDirection = [Direction.DOWN, Direction.LEFT];
            }
        }
        const targetDirection = possibleDirection[angle2 > 0.785 ? 0 : 1];
        if(targetDirection == this.currentDirection) return false;
        const targetIndex = directionClockwise.indexOf(targetDirection);
        const currentIndex = directionClockwise.indexOf(this.currentDirection);
        let turnDirectionCount = targetIndex > currentIndex ? targetIndex - currentIndex : targetIndex + directionClockwise.length - currentIndex;
        const isClockwise : boolean = turnDirectionCount <= 2;
        turnDirectionCount = isClockwise ? turnDirectionCount : directionClockwise.length - turnDirectionCount;
        let spriteFrames = [];
        const start = currentIndex * lengthEveryDirection;
        const end = targetIndex * lengthEveryDirection;
        if(end > start){
            spriteFrames = atlas.slice(start, targetIndex * lengthEveryDirection);
        }else{
            spriteFrames = atlas.slice(start, atlas.length);
            spriteFrames.concat(atlas.slice(0, end));
        }
        if(!isClockwise){
            spriteFrames.reverse();
        }
        this._component.playSpin(spriteFrames);
        this.elapsed -= turnDirectionCount * 0.5;
        this.currentDirection = targetDirection;
        return true;

    }
}