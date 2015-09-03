
var AnimationMgr = {
    //frames   :(plist,parent,speed) if speed != null auto play
    //particle :(plist,isRealse,parent)
    create: function(p0, p1, p2) {
        var node;
        if (typeof(p1) == "boolean") {
            node = cc.ParticleSystem.create(p0);
            if (p1)
                node.setAutoRemoveOnFinish(true);
            if (p2)
                p2.addChild(node, 10000);
        } else {
            cc.spriteFrameCache.addSpriteFrames(p0);
            node = plistData.create(p0.replace(".plist", ""), p2);
            if (p1)
                p1.addChild(node);
        }
        return node;
    },
    framesNode:function(fileName,isLoop,speed,callback){
        var anim = this.frames.apply(this,arguments);
        var node = cc.Sprite.create('#'+fileName+'_0.png');
        node.runAction(anim);        
    },
    frames:function(fileName,isLoop,speed){
        var lastParam = arguments[arguments.length-1];
        speed = typeof(speed) == 'number' ? speed : 0.08;
        isLoop = typeof(isLoop) == 'boolean' ? isLoop : false;

        var animate = this.animate(fileName,speed);
        var acts = [];
        if(isLoop){
            animate = cc.RepeatForever.create(animate);
        } 
        if(typeof(lastParam) == "function"){
            acts.push(animate)
            acts.push(cc.CallFunc.create(lastParam));
        }
        if(!isLoop){
            acts.push(cc.RemoveSelf.create());
        }
        if(acts.length > 0){
            return cc.Sequence.create(acts);
        }
        return animate;
    },
    animate:function(fileName,speed){
        cc.spriteFrameCache.addSpriteFrames(fileName+'.plist');
        var frames = [];
        for (var i = 0; i < 100; i++) {
            var frame = cc.spriteFrameCache.getSpriteFrame(fileName + "_" + i + ".png");
            if (frame){
                frames.push(frame);
            } else {
                break;
            }
        }
        return cc.Animate.create(cc.Animation.create(frames, speed));
    },
    createParticle:function(plist,autoRelease,parent){
        var node = cc.ParticleSystem.create(plist);
        if(autoRelease){
            node.setAutoRemoveOnFinish(true);
        } 
        if(parent){
            parent.addChild(node);
        }
        return node;
    },
    createClip:function(mask,parent){
        mask.setAnchorPoint(0,0);
        mask.setPosition(0,0);
        var clip = cc.ClippingNode.create();
        clip.setPosition(0,0);
        clip.setStencil(mask);
        clip.setInverted(false);
        clip.setAlphaThreshold(0.05);
        clip.setContentSize(mask.getContentSize().width,mask.getContentSize().height);
        if(parent){
            parent.addChild(clip);
        }
        return clip;
    },
}

var plistData = cc.Sprite.extend({
    sprName: "",
    callfunc: null,
})

plistData.create = function(sprName, speed) {
    var pd = new plistData();
    pd.setSpriteFrame(sprName + "_0.png");
    pd.sprName = sprName;
    if (speed != undefined){
        pd.play(speed);
    }
    return pd;
}
plistData.prototype.play = function(speed, isLoop, isAutoRemove, startIdx, endIdx) {
    startIdx = startIdx || 0;
    endIdx = endIdx || 100;
    speed = speed || 0.08;
    if (isLoop === undefined)
        isLoop = false;

    if (isAutoRemove === undefined) {
        isAutoRemove = true;
    }

    var lastParam = arguments[arguments.length-1]
    if(typeof(lastParam) == "function"){
        this.callfunc = lastParam;
    }
    
    var frames = [];
    for (var i = startIdx; i < endIdx; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame(this.sprName + "_" + i + ".png");
        if (frame)
            frames.push(frame);
        else
            break;
    }
    if (frames.length > 0) {
        var act = cc.Animate.create(cc.Animation.create(frames, speed));
        if (isLoop) {
            act = cc.RepeatForever.create(act);
        } else if (this.callfunc) {
            var arr = [];
            arr.push(act);
            arr.push(cc.CallFunc.create(this.callfunc,this));
            if (isAutoRemove) {
                arr.push(cc.RemoveSelf.create());
            }
            act = cc.Sequence.create(arr)
        } else {
            var arr = [];
            arr.push(act);
            if (isAutoRemove) {
                arr.push(cc.RemoveSelf.create());
            }
            act = cc.Sequence.create(arr);
        }
        this.runAction(act);
    }
}
