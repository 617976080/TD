
import EnemyStateAbstract, {EnemyState} from "./EnemyState";

export default class EnemyStateFrozen extends EnemyStateAbstract {
    private deltaSpeed : number;
    protected getId(): string {
        return EnemyState.FROZEN + "";
    }

    protected onStateChange(): void {
        const delta = this.enemy.characterAttr.moveSpeed * 0.5;
        this.enemy.characterAttr.moveSpeed -= delta;

        this.deltaSpeed = delta;
    }

    protected endStateRecover(): void {
        this.enemy.characterAttr.moveSpeed += this.deltaSpeed;
    }
}