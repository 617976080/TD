import HeroBaseAttr from "./HeroBaseAttr";
import CharacterAttr from "./CharacterAttr";
import Hero from "../Character/Hero";

export default class HeroAttr extends CharacterAttr<HeroBaseAttr, Hero>{
    private attackPower : number;
    public constructor(baseAttr : HeroBaseAttr, character : Hero) {
        super(baseAttr, character);
        this.attackPower = baseAttr.maxAttackPower;
    }
    get maxAttackPower() : number{
        return this.baseAttr.maxAttackPower;
    }
    get attackRange() : number{
        return this.baseAttr.attackRange;
    }
    get attackInterval() : number{
        return this.baseAttr.attackInterval;

    }
}