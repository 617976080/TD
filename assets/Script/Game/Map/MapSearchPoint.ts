export default class MapSearchPoint{
    public x : number;
    public y : number;
    public allowWalk : boolean;
    public parent : MapSearchPoint = null;
    public F : number = 0;
    public H : number = 0;
    public G : number = 0;
    public static endPos : MapSearchPoint;
    public constructor(x : number, y : number, allowWalk : boolean){
        this.x = x;
        this.y = y;
        this.allowWalk = allowWalk;
    }
    public setParent(parent : MapSearchPoint){
        this.parent = parent;
        this.G = this.getG(parent);
        this.H = (Math.abs(this.x - MapSearchPoint.endPos.x) + Math.abs(this.y - MapSearchPoint.endPos.y)) * 10;
        this.F = this.H + this.G;
    }
    public updateParent(newParent : MapSearchPoint){
        let newG = this.getG(newParent);
        if(newG >= this.G) return;
        this.setParent(newParent)
    }
    private getG(parent : MapSearchPoint) : number{
        if(parent.x == this.x || this.y == parent.y){
            return 10 + parent.G;
        }
        return 14 + parent.G;
    }
}