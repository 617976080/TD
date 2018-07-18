import Global from "../../Common/Global";
import Enemy from "./Enemy";
import HeroStateAbstract from "./HeroState";
import {HeroState} from "./Hero";

export default class HeroWaitState extends HeroStateAbstract {
    onState(): void {

    }

    endState(): void {

    }

    update(dt: number): void {
        const manager = Global.getGameBase().getCharacterManager();
        const hero = this.hero;
        const center = hero.belongBuild.node.getPosition();
        const range = hero.getSearchRange();
        let target = manager.getOneEnemyAtRange(center, range);

        if(target != null){
            hero.prevTarget = target;
            hero.changeState(HeroState.ATTACK);
        }
    }
}