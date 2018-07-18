
import MapSearchPoint from "./MapSearchPoint";

export default class MapSearch{
    private mapTiled : Array<MapSearchPoint[]> = [];
    private mapSize : cc.Size;
    private start : MapSearchPoint;
    private end : MapSearchPoint;
    private openList : MapSearchPoint[] = [];
    private closeList : MapSearchPoint[] = [];
    private cachePath : MapSearchPoint[] = null;
    private static possibles = [
        [0, -1],
        [0, 1],
        [1, 0],
        [-1, 0],
    ];
    public constructor(mapSize : cc.Size, allowWalk : Array<boolean[]>){
        for(let i = 0; i < mapSize.width; i++){
            let row : MapSearchPoint[] = [];
            for(let j = 0; j < mapSize.height; j++){
                row.push(new MapSearchPoint(i, j, allowWalk[i][j]));
            }
            this.mapTiled.push(row);
        }
        this.mapSize = mapSize;
    }
    private getPath() : MapSearchPoint[]{
        let paths : MapSearchPoint[] = [];
        let current : MapSearchPoint = this.closeList[this.closeList.length - 1];
        while(current != this.start){
            paths.push(current);
            current = current.parent;
        }
        this.cachePath = paths;
        return paths;
    }
    private clear() : void{
        this.closeList = [];
        this.openList = [];
        this.end = null;
        this.start = null;
        this.cachePath = null;
        MapSearchPoint.endPos = null;
    }
    private pointsToPos(points : MapSearchPoint[]) : cc.Vec2[]{
        let vec2s : cc.Vec2[] = [];
        for(let point of points){
            vec2s.push(new cc.Vec2(point.x, point.y));
        }
        return vec2s;
    }
    public search(start : cc.Vec2, end : cc.Vec2) : cc.Vec2[]{
        if(this.cachePath !== null &&
            this.start.x  == start.x &&
            this.start.y  == start.y &&
            this.end.x    == end.x &&
            this.end.y    == end.y
        ){
            return this.pointsToPos(this.cachePath);
        }

        this.clear();

        let startMapSearchPoint = this.mapTiled[start.x][start.y];
        let endMapSearchPoint = this.mapTiled[end.x][end.y];
        this.start = startMapSearchPoint;
        this.end = endMapSearchPoint;
        MapSearchPoint.endPos = endMapSearchPoint;

        if(startMapSearchPoint.allowWalk === false) return null;
        if(endMapSearchPoint.allowWalk === false) return null;

        let current : any = startMapSearchPoint;
        let result = false;
        while (true){
            current = this._search(current);
            if(current === true || current === false) {
                result = current;
                break;
            }
        }
        if(result === false) return null;
        return this.pointsToPos(this.getPath());
    }
    public updateAllowWalk(allowWalk : boolean, pos : cc.Vec2) : boolean{
        let tile = this.mapTiled[pos.x][pos.y];
        if(allowWalk == tile.allowWalk) return false;
        tile.allowWalk = allowWalk;
        this.clear();
        return true;
    }
    private _search(current : MapSearchPoint) : boolean | MapSearchPoint{
        let points = this.getAround(current);
        for(let point of points){
            if(!this.canCross(current, point)){
                continue;
            }
            if(this.inClose(point)){
                continue;
            }
            if(this.inOpen(point)){
                point.updateParent(current);
            }else{
                point.setParent(current);
                this.openList.push(point);
            }
        }
        let next : MapSearchPoint = this.getMinFMapSearchPointInOpen();
        if(next === null){
            return false;
        }
        this.putToClose(next);
        if(next == this.end){
            return true;
        }
        return next;
    }
    private canCross(start : MapSearchPoint, end : MapSearchPoint) : boolean{
        if(start.x == end.x || start.y == end.y){
            return true;
        }
        let point1 = this.getAroundItem(start.x, end.y);
        let point2 = this.getAroundItem(end.x, start.y);
        if(point1 !== null || point2 !== null){
            return true;
        }else{
            return false;
        }
    }
    private inOpen(point : MapSearchPoint) : boolean{
        return this.openList.indexOf(point) !== -1;
    }
    private inClose(point : MapSearchPoint) : boolean{
        return this.closeList.indexOf(point) !== -1;
    }
    private getMinFMapSearchPointInOpen() : MapSearchPoint{
        this.openList.sort(function(point1 : MapSearchPoint, point2 : MapSearchPoint){
            return point1.F - point2.F;
        });
        return this.openList[0] || null;
    }
    private putToClose(point : MapSearchPoint){
        this.closeList.push(point);
        let index = this.openList.indexOf(point);
        if(index === -1) return;
        this.openList.splice(index, 1);
    }
    private getAround(center : MapSearchPoint) : MapSearchPoint[]{
        let points : MapSearchPoint[] = [];
        let x = center.x, y = center.y;
        for(let item of MapSearch.possibles){
            let point : MapSearchPoint = this.getAroundItem(x + item[0], y + item[1]);
            if(point === null) continue;
            points.push(point);
        }
        return points;
    }
    public getAroundCanWalk(center : cc.Vec2) : cc.Vec2[]{
        return this.pointsToPos(this.getAround(this.mapTiled[center.x][center.y]));
    }
    private getAroundItem(x : number, y : number){
        if(x < 0 || x >= this.mapSize.width) return null;
        if(y < 0 || y >= this.mapSize.height) return null;
        let point = this.mapTiled[x][y];
        if(point.allowWalk === false) return null;
        return point;
    }
    public canWalkAt(pos : cc.Vec2) : boolean{
        return this.mapTiled[pos.x][pos.y].allowWalk;
    }
}
