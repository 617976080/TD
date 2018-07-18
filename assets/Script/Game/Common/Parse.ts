export abstract class Parse{
    private cache : Object = {};
    public abstract parse(rawData : any);
    protected getAttrByMap<T>(attrKey : string,data : Object, dataMap : Map<string, T>): T{
        const rawData = this.getAttr<string>(attrKey, data);
        if(!dataMap.has(rawData)) {
            return new Error("Value \"" + rawData +"\" attr \"" + attrKey + "\" is illegal! it must be a value in" + dataMap);
        }
        return dataMap.get(rawData);
    }
    protected getAttr<T>(attrKey : string,data : Object, defaultValue? : T) : T{
        if(typeof data != "object") throw new Error("parse data is not a object:" + data);
        if(defaultValue == null && !data.hasOwnProperty(attrKey)){
            cc.error(data);
            throw new Error("parse data has not the attr:" + attrKey);
        }
        return data.hasOwnProperty(attrKey) ? data[attrKey] : defaultValue;
    }
    protected getUniqueAttr<T>(attrKey : string, item : Object) : T{
        const attr = this.getAttr<T>(attrKey, item);
        if(!this.cache.hasOwnProperty(attrKey)){
            this.cache[attrKey] = [];
        }
        const cacheArray = this.cache[attrKey];
        if(cacheArray.indexOf(attr) !== -1) throw new Error("enemy " + attr + " is exist, please not to repeat define!");
        cacheArray.push(attr);
        return attr;
    }
    protected checkAttributes(data : any,...attrKeys : string[]) : void{
        if(typeof data != 'object'){
            throw new Error("Data " + data + " is illegal, it must be a object");
        }
        for(let attrKey of attrKeys){
            if(!data.hasOwnProperty(attrKey)){
                throw new Error("Data must has attribute\"" + attrKey +  "\"");
            }
        }
    }
}