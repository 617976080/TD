import HeroStateAbstract from "./HeroState";
const A = 180 / Math.PI;
const STANDER_ROTATION_COUNT = 8;
const STANDER_ROTATION_OFFSET = 360 / STANDER_ROTATION_COUNT;

const DIRECTION_COUNT = 24;
const DIRECTION_OFFSET = 360 / DIRECTION_COUNT;

export const TURN_EXAMPLE = 30;
export default class HeroAttackState extends HeroStateAbstract {
    private turnDuration : number;
    private elapsed : number = 0;
    private isOnTurn = true;
    onState(): void {
        const hero = this.hero;
        const currentDirection = hero.direction;
        const targetDirection = this.getDirection(this.getRotation(hero.node.getPosition(), hero.prevTarget.node.getPosition()));
        const isAsc = targetDirection > currentDirection ? (targetDirection - currentDirection) < DIRECTION_COUNT / 2 : (currentDirection - targetDirection) > DIRECTION_COUNT / 2
        let index : number[] = [];
        if(targetDirection > currentDirection){
            for(let i = currentDirection; i <= targetDirection; i++) {
                index.push(i);
            }
        }else{
            for(let i = currentDirection; i <= STANDER_ROTATION_COUNT; i++) {
                index.push(i);
            }
            for(let i = 0; i <= currentDirection; i++) {
                index.push(i);
            }
        }

        if(!isAsc){
            index.reverse();
        }

        const res = this.hero.spinAtlas;
        const spriteFrames : cc.SpriteFrame[] = [];
        index.forEach(value => {
            spriteFrames.push(res.getSpriteFrame(hero.getCharacterType() + "_spin" + value));
        });

        hero.baseComponent.createAnimationClip(spriteFrames, "spin", TURN_EXAMPLE);
        hero.baseComponent.playAnimation("spin");

        this.turnDuration = (spriteFrames.length - 1) * (1 / TURN_EXAMPLE) * 1000;
    }

    endState(): void {
    }

    update(dt: number): void {
        if(this.isOnTurn && (this.elapsed += dt) > this.turnDuration){
            this.elapsed = 0;
            this.isOnTurn = false;
        }

        if(this.isOnTurn){
            return;
        }

        if((this.elapsed += dt) > this.hero.characterAttr.attackInterval){
            this.attack();
        }
    }
    private attack() : void{

    }
    private getRotation(start : cc.Vec2, end : cc.Vec2) : number{
        const result = cc.pAngle(start, end) * A;
        return end.y > start.y ? result : 360 - result;
    }
    private getStanderRotation(rotation : number){
        return Math.round(rotation / STANDER_ROTATION_OFFSET) * STANDER_ROTATION_OFFSET;
    }
    private getDirection(rotation) : number{
        return Math.round(rotation / DIRECTION_OFFSET) * DIRECTION_OFFSET;
    }
}