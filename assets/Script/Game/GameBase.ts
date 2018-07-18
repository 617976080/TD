import GameBaseState, {GameState} from "./GameState/GameBaseState";
import GameBasePrepareState from "./GameState/GameBasePrepareState";
import CountDown from "./Component/CountDown";
import GameBaseStartState from "./GameState/GameBaseStartState";
import StageSystem from "./StageSystem/StageSystem";
import GameDataBase from "./DataBase/GameDataBase";
import ResourcesLoader from "./Common/ResourcesLoader";
import CharacterFactory from "./Factory/CharacterFactory";
import TowerFactory from "./Factory/TowerFactory";
import AttributeFactory from "./Factory/AttributeFactory";
import MapComponent from "./Component/MapComponent";
import MapSystem from "./Map/MapSystem";
import Global from "./Common/Global";
import CharacterManager from "./Manager/CharacterManager";
import AnimationManager from "./Manager/AnimationManager";
import TowerSystem from "./TowerSystem/TowerSystem";
import UI from "./UI/UI";
import InformationSystem from "./InformationSystem/InformationSystem";
import GameOverState from "./GameState/GameOverState";
const SPEED_UP_MUTIPLE = 8;
export default class GameBase{
    get gameUISpriteAtlas(): cc.SpriteAtlas {
        return this._gameUISpriteAtlas;
    }
    get node(): cc.Node {
        return this._node;
    }
    private _node : cc.Node;
    private stateObject : GameBaseState;
    get countDownComponent(): CountDown {
        return this._countDownComponent;
    }
    private _countDownComponent : CountDown;
    private static _instance = null;
    private stageSystem : StageSystem;
    private dataBase : GameDataBase;
    private characterFactory : CharacterFactory;
    private towerFactory : TowerFactory;
    private attributeFactory : AttributeFactory;
    private mapSystem : MapSystem;
    private towerSystem : TowerSystem;
    private characterManager : CharacterManager;
    private animationManager : AnimationManager;
    private informationSystem : InformationSystem;
    private _isPause : boolean = false;
    private _isSpeedUp : boolean = false;
    private _gameUISpriteAtlas : cc.SpriteAtlas;
    private UI : UI;
    public TD : cc.SpriteAtlas;
    public static get instance(){
        if(GameBase._instance === null){
            throw new Error("GameBase is has not instance");
        }
        return GameBase._instance;
    }
    public constructor(UI : UI, node : cc.Node, countDownComponent : CountDown, mapComponent : MapComponent, characterPrefab : cc.Prefab,towerPrefab : cc.Prefab, TD : cc.SpriteAtlas, gameUISpriteAtlas : cc.SpriteAtlas){
        Global.setGameBase(this);
        const stageLV = Global.getLV();
        this._node = node;
        this.UI = UI;
        this._countDownComponent = countDownComponent;
        GameBase._instance = this;
        this.initialize(stageLV,mapComponent, characterPrefab, towerPrefab);
        this.TD = TD;
        this._gameUISpriteAtlas = gameUISpriteAtlas;
    }
    public update(dt : number) : void{
        if(this.stateObject == null) return;
        if(this._isPause) return;
        this.stateObject.updateState(this._isSpeedUp ? dt * SPEED_UP_MUTIPLE : dt);
    }
    private async initialize(stageLV : number,mapComponent : MapComponent, characterPrefab : cc.Prefab, towerPrefab : cc.Prefab) : void{
        this.animationManager = new AnimationManager();
        this.characterManager = new CharacterManager(this);
        this.characterFactory = new CharacterFactory(this, characterPrefab);
        this.attributeFactory = new AttributeFactory(this);
        this.towerFactory = new TowerFactory(this, towerPrefab);
        await this.getLoadPromise(() => {
            this.dataBase = new GameDataBase(stageLV);
        });
        await this.getLoadPromise(() => {
            this.stageSystem = new StageSystem(this,stageLV);
            this.towerSystem = new TowerSystem(this);
        });
        await this.getLoadPromise(() => {
            this.mapSystem = new MapSystem(this, mapComponent, stageLV);
            const updateHP = this.UI.updateStageHP;
            const updateMoney = this.UI.updateMoney;
            const updateEnemyQuantity = this.UI.updateEnemyQuantity;
            this.informationSystem = new InformationSystem(this,{updateHP, updateMoney, updateEnemyQuantity});
        });
        await this.getLoadPromise(() =>{
            this.changeState(GameState.PREPARE_STATE);
        })
    }
    private getLoadPromise(callFn : () => void) : Promise{
        return  new Promise(resolve => {
            ResourcesLoader.run(() => {
                callFn();
                resolve();
            });
        });
    }
    public changeState(state : GameState,...args : any[]) : void{
        let stateObject;
        switch (state){
            case GameState.PREPARE_STATE:
                stateObject = new GameBasePrepareState(this);
                break;
            case GameState.GAME_START:
                stateObject = new GameBaseStartState(this);
                break;
            case GameState.GAME_OVER:
                stateObject = new GameOverState(this, ...args);
        }
        stateObject.onState();
        this.stateObject = stateObject;
    }
    public playMusic(audioClip : cc.AudioClip) : void{
        let audioSource = this._node.getComponent<cc.AudioSource>(cc.AudioSource);
        if(audioSource == null){
            audioSource = this._node.addComponent(cc.AudioSource);
        }
        audioSource.clip = audioClip;
        audioSource.play();
    }
    public getStageSystem(){
        return this.stageSystem;
    }
    public getCharacterFactory(){
        return this.characterFactory;
    }
    public getAttributeFactory(){
        return this.attributeFactory;
    }
    public getTowerFactory(){
        return this.towerFactory;
    }
    public getTowerSystem(){
        return this.towerSystem;
    }
    public getDataBase(){
        return this.dataBase;
    }
    public getMapSystem(){
        return this.mapSystem;
    }
    public getCharacterManager() : CharacterManager{
        return this.characterManager;
    }
    public getAnimationManager() : AnimationManager{
        return this.animationManager;
    }
    public pause() : void{
        this._isPause = true;
    }
    public resume() : void{
        this._isPause = false;
    }
    public toggle() : void{
        this._isPause = !this._isPause;
    }
    public speedUp() : void{
        this._isSpeedUp = true;
    }
    public disSpeedUp() : void{
        this._isSpeedUp = false;
    }
    public updateEnemyQuantity(quantity : number) : void{
        this.UI.updateEnemyQuantity(quantity);
    }
    public getInformationSystem() : InformationSystem{
        return this.informationSystem;
    }
}