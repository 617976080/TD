export default class Global {
    constructor() {
    }
    private static gameBase : any;
    private static LV : number = 1;
    public static setGameBase(gameBase) : void{
        Global.gameBase = gameBase;
    }
    public static getGameBase() : any{
        return Global.gameBase;
    }
    public static getLV() : number{
        return Global.LV || 1;
    }
    public static GoNextLV() : void{
        Global.LV++;
    }
}