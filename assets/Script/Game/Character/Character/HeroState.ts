import Hero from "./Hero";

export default abstract class HeroStateAbstract{
    protected hero : Hero;
    public constructor(hero : Hero){
        this.hero = hero;
    }
    public abstract onState() : void;
    public abstract endState() : void;
    public abstract update(dt : number) : void;
}