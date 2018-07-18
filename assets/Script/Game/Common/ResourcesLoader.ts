interface ResourcesItem{
    url : string | string[];
    success? : (resource : any,...data : any[]) => void;
    fail? : (error, url ? : string) => boolean;
    data? : any;
    type? : any;
}
interface ResourcesGroup{
    items : ResourcesItem[];
    name : string;
    amount : number;
    success? : () => void;
}
export default class ResourcesLoader{
    private static groups : ResourcesGroup[] = [];
    private static currentStage : ResourcesGroup;
    private static cacheCount : number;
    private static resourceCache = new Map<string, any>();
    public static addGroup(loadStageName : string, items : ResourcesItem[], success? : () => void) : void{
        ResourcesLoader.groups.push({items, name : loadStageName, amount : items.length,success});
    }
    public static async run(callFn : () => void) : void{
        for(let group of ResourcesLoader.groups){
            ResourcesLoader.updateStage(group);
            if(Array.isArray(group.items)){
                for(let item of group.items){
                    let callFns : PromiseLike[] = [];
                    callFns.push(ResourcesLoader.getLoadPromise(item));
                    await Promise.all(callFns);
                }
            }
            if(group.success != null){
                group.success();
            }
        }
        this.clear();
        callFn();
        return;
    }
    private static getLoadPromise(item : ResourcesItem){
        const errorHandel : (error, url? : string) => void = item.fail == null ? this.handleError : item.fail;
        return new Promise((resolve, reject) => {
            const url : any = Array.isArray(item.url) ? item.url : [item.url];
            cc.loader.loadResArray(url,item.type || null,(error, assets) => {
                const resource = assets.length === 1 ? assets[0] : assets;
                if(error && errorHandel(error, url)){
                    return;
                }
                if(item.success){
                    item.success(resource,...item.data);
                }
                this.updateCount();
                resolve(true);
            });
        });
    }
    private static handleError(error : Error, url? : string) : boolean{
        if(url){
            cc.log("Url : \"" + url +"\"");
        }
        cc.log(error.message);
        return true;
    }
    private static updateStage(group : ResourcesGroup){
        ResourcesLoader.currentStage = group;
        ResourcesLoader.cacheCount = 0;
    }
    private static updateCount(){
        const stage = ResourcesLoader.currentStage;
        cc.log(stage.name + "(" + (++ResourcesLoader.cacheCount) +"/" + stage.amount +")");
    }
    private static clear(){
        ResourcesLoader.groups = [];
        ResourcesLoader.currentStage = null;
        ResourcesLoader.cacheCount = null;
    }
    public static getResources(url : string) : any{
        const result =  this.resourceCache.get(url);
        if(result == null){
            throw new Error("Resource in" + url + " is not loaded.");
        }
        return result;
    }
}