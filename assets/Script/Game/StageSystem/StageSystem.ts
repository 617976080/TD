import Config from "../../Public/Config";
import GameSystem from "../../GameSystem";
import {EnemyWave, EnemyWaveItem} from "../DataBase/StageDataParse";
import ResourcesLoader from "../Common/ResourcesLoader";
import MapSystem from "../Map/MapSystem";
import CharacterFactory from "../Factory/CharacterFactory";
import {EnemyState, EnemyStateAnimation, EnemyStateAnimationMap} from "../Character/Attr/EnemyState";
export default class StageSystem extends GameSystem{
    protected currentStageLv : number;
    private enemyWaves : EnemyWave[];
    private elapsed : number;
    private currWave : EnemyWave;
    private nextEnemy : EnemyWaveItem;
    private finish : boolean = false;
    private startPos : cc.Vec2 = null;

    private _mapSystem : MapSystem;
    private _characterFactory : CharacterFactory;
    get characterFactory(): CharacterFactory {
        if(this._characterFactory) return this._characterFactory;
        return this._characterFactory = this.gameBase.getCharacterFactory();
    }
    public isFinish() : boolean{
        return this.finish;
    }
    get mapSystem(): MapSystem {
        if(this._mapSystem) return this._mapSystem;
        return this._mapSystem = this.gameBase.getMapSystem();
    }
    public constructor(gameBase, currentStage : number){
        super(gameBase);
        this.currentStageLv = currentStage;
        this.enemyWaves = gameBase.getDataBase().getStageData().enemyWaves;
        const enemyIdSet = this.getNeedLoadEnemy();
        this.addLoad(enemyIdSet);
        this.goToNextWave();
    }
    public update(dt : number) : void{
        if(!this.finish && (this.elapsed += dt) >= this.nextEnemy.time){
            this.createEnemy();
        }
    }
    private createEnemy(){
        const data = this.nextEnemy;
        const enemies = this.currWave.enemies;
        if(enemies.length > 0){
            this.nextEnemy = enemies.shift();
        }else{
            this.goToNextWave();
        }
        const enemy = this.characterFactory.createEnemy(data.enemyType, this.getStartPos(), this.currWave.wayId);
        cc.log("enemyType" + data.enemyType, "enemyId" + data.enemyId);
    }
    private getStartPos() : cc.Vec2{
        if(this.startPos) return this.startPos;
        return this.startPos = this.gameBase.getMapSystem().getEnemyWayItem(this.currWave.wayId, 0);
    }
    private goToNextWave() : void{
        if(this.enemyWaves.length === 0){
            this.finish = true;
            return;
        }
        this.currWave = this.enemyWaves.shift();
        this.elapsed = 0;
        this.nextEnemy = this.currWave.enemies.shift();
    }
    private getNeedLoadEnemy() : Set<string>{
        const result = new Set<string>();
        for(let wave of this.enemyWaves){
            for(let item of wave.enemies){
                result.add(item.enemyId);
            }
        }
        return result;
    }
    private addLoad(enemyIdSet : Set<string>) : void{
        const enemyTypeArray = [];
        enemyIdSet.forEach((item) => {
            const urls : string[] = [];
            [1,2].forEach((index) =>{
                urls.push(Config.getEnemySpriteUrl("Enemy/" + item + index));
            });
            enemyTypeArray.push({
                url : urls,
                success : (resources, data : string) => {
                    this.gameBase.getCharacterFactory().initAnimationRes(resources, data);
                },
                data : item,
                type : cc.SpriteAtlas
            });
        });
        ResourcesLoader.addGroup("怪物资源",enemyTypeArray, () => {
            const manager = this.gameBase.getAnimationManager();
            [EnemyState.FROZEN, EnemyState.DIZZINESS].forEach(state => {
                manager.addAnimationGroupRes([this.gameBase.TD], state + "", EnemyStateAnimationMap);
            });
        });
    }
}