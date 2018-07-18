export default class AnimationManager {
    private animationGroupRes = new Map<string, Map<any, cc.SpriteFrame[]>>();
    private animationSingleRes = new Map<string, cc.SpriteFrame[]>();
    public addAnimationGroupRes<T>(resources : cc.SpriteAtlas[], id : string, animationMap : Map<string, T>) : void{
        if(this.animationGroupRes.has(id)) return;
        const animations = new Map<T, cc.SpriteFrame[]>();
        animationMap.forEach((animation, string) => {
            const prefix = string;
            const spriteFrames : cc.SpriteFrame[] = [];
            for(let i = 1; ; i++){
                const key = prefix + i;
                let spriteFrame : cc.SpriteFrame;
                for(let atlas of resources){
                    spriteFrame = atlas.getSpriteFrame(key);
                    if(spriteFrame) break;
                }
                if(spriteFrame == null){
                    break;
                }else{
                    spriteFrames.push(spriteFrame);
                }
            }
            animations.set(animation, spriteFrames);
        });
        this.animationGroupRes.set(id, animations);
    }
    public getAnimationGroupRes<T>(id : string) : Map<T, cc.SpriteFrame[]>{
        const item = this.animationGroupRes.get(id);
        if(item == null){
            throw new Error("Animation spriteFrames of " + id + " is not loaded");
        }
        return item;
    }
    public addAnimationRes(id : string, spriteFrames : cc.SpriteFrame[], rewrite = false) : void{
        if(id == null){
            throw new Error("ID not be allow as \"NULL\"");
        }
        if(!rewrite){
            this.animationSingleRes.has(id);
            throw new Error("Resources " + id + " is exist!");
        }
        this.animationSingleRes.set(id, spriteFrames);
    }
    public getAnimationRes(id : string) : cc.SpriteFrame[]{
        if(id == null){
            throw new Error("ID not be allow as \"NULL\"");
        }
        const result = this.animationSingleRes.get(id);
        if(result == null){
            throw new Error("Resource \"" + id + "\" is not exist!");
        }
        return result;
    }
}