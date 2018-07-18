import Enemy from "../Character/Character/Enemy";
import GameSystem from "../../GameSystem";
import {GameState} from "../GameState/GameBaseState";
import Hero from "../Character/Character/Hero";

export default class CharacterManager extends GameSystem{
    private enemy : Enemy[] = [];
    private mapTiledSize : cc.Size;
    private distancePXOneRange : number;
    public getDistancePXOneRange() : number{
        if(this.distancePXOneRange) return this.distancePXOneRange;
        const tiledSize = this.getMapTiledSize();
        this.distancePXOneRange = (tiledSize.height + tiledSize.width) / 2;
    }
    public addEnemy(enemy : Enemy) : void{
        this.enemy.push(enemy);
        this.gameBase.getMapSystem().putCharacter(enemy);
        this.gameBase.getInformationSystem().updateEnemyQuantity(this.enemy.length);
    }
    public removeEnemy(enemy : Enemy) : void{
        const array = this.enemy;
        const gameBase = this.gameBase;
        array.splice(array.indexOf(enemy), 1);
        gameBase.getMapSystem().removeCharacter(enemy);
        gameBase.updateEnemyQuantity(this.enemy.length);
        if(gameBase.getStageSystem().isFinish() && this.enemy.length === 0){
            gameBase.changeState(GameState.GAME_OVER, true);
        }
    }
    public addHero(hero : Hero) : void{

    }
    public removeHero(hero : Hero) : void{

    }
    public updateEnemySort() : void{
        this.enemy.sort((a, b) => {
            return a.wayIndex - b.wayIndex;
        });
    }
    public update(dt: number): void {
        this.enemy.forEach((enemy) => {enemy.update(dt)});
    }
    private getMapTiledSize() : cc.Size{
        if(this.mapTiledSize) return this.mapTiledSize;
        return this.mapTiledSize = this.gameBase.getMapSystem().getMapTiledSize();
    }
    public getEnemyAtRange(centerPos : cc.Vec2, range : number) : Enemy[]{
        const distancePX = this.getDistancePXOneRange() * range;
        const enemyAtRange = this.enemy.filter((enemy) => {
            return cc.pDistance(enemy.node.getPosition(), centerPos) < distancePX;
        });
        enemyAtRange.sort((a, b) => {
            return a.wayIndex - b.wayIndex;
        });
        return enemyAtRange;
    }
    public enemyAtRange(centerPos : cc.Vec2,enemy : Enemy, range : number){
        return cc.pDistance(centerPos, enemy.node.getPosition()) < range * this.getDistancePXOneRange();
    }
    public getOneEnemyAtRange(centerPos : cc.Vec2, range : number, filterFn ? : (enemy : Enemy) => boolean)  : Enemy{
        const enemyAtRange = this.getEnemyAtRange(centerPos, range);
        if(filterFn == null){
            return enemyAtRange[0] || null;
        }
        for(let i = 0; i < enemyAtRange.length; i++){
            const enemy = enemyAtRange[i];
            if(filterFn(enemy) === true){
                return enemy;
            }
        }
        return enemyAtRange[0] || null;
    }
}