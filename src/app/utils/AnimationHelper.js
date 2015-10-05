/**
 * @Disc create frame animation or particle
 *
 * @type {Object}
 */
var AnimationHelper = {

    /**
     * @Author lihuiqun
     * @Disc   AnimationMgr.frame('filename'); 'not play only return a spriteFrame'
     *         AnimationMgr.frame('filename',ccnode); 'not play return a spriteFrame and add it to the parent'
     *         AnimationMgr.frame('filename',ccnode,loop=1,delay=0); 'auto play once, return a spriteFrame and add it to the parent'
     *         AnimationMgr.frame('filename',ccnode,callback); 'once play and callback, return a spriteFrame and add it to the parent'
     *         frame.speed = 0.08;
     *         frame.play(callback);
     *         frame.paly(2,0);
     *         frame.play();
     * @param  {[String]}
     * @param  {[Node]}
     * @param  {[Number or Function]}
     * @return {[SpriteFrame]}
     */

    frame: function(fileName, parent, param, param1) {
        fileName = fileName.replace('.png', '');
        var _idx = fileName.lastIndexOf('_');
        var startIdx = fileName.substring(_idx + 1);
        var plistName = fileName.substring(0, _idx);

        cc.spriteFrameCache.addSpriteFrames(plistName + '.plist');
        var spriteFrame = new cc.Sprite();
        spriteFrame.setSpriteFrame(fileName + '.png');
        spriteFrame.loop = typeof(param) == 'number' ? param : 1;
        spriteFrame.speed = 0.08;
        spriteFrame.delay = 0;
        spriteFrame.autoRelease = false;
        /**
         * @Disc   frame.play(loop = 1,callback=null);
         *         frame.play(loop = 1,delay = 0.5,callback);
         *         frame.play();
         * @param  {[loop or callback]}
         * @return {[SpriteFrame]}
         */
        spriteFrame.play = function(param, param1) {
            var frames = AnimationHelper.frames(plistName, startIdx);
            var animate = cc.Animate.create(cc.Animation.create(frames, spriteFrame.speed));
            Array.prototype.unshift.call(arguments, spriteFrame.autoRelease);
            Array.prototype.unshift.call(arguments, animate);
            var action = AnimationHelper.animateAction.apply(AnimationHelper, arguments);
            spriteFrame.runAction(action);
        }
        if (parent) {
            parent.addChild(spriteFrame);
            if (param) {
                var agrs = Array.prototype.slice.call(arguments, 2);
                spriteFrame.play.apply(spriteFrame, agrs);
            }
        }

        return spriteFrame;
    },

    /**
     * @Disc   animateAction(animate,loop=0,delay=0);
     *         animateAction(animate,callback);
     * @param  {[Animate]}
     * @param  {[Number or callback]} if loop = -1 repeat forever
     * @param  {[Number]} default null
     * @return {[Action]}
     */
    animateAction: function(animate, autoRelease, arg0, arg1) {
        var loop = typeof(arg0) == 'number' ? arg0 : 1;
        var callback = typeof(arguments[arguments.length - 1]) == 'function' ? arguments[arguments.length - 1] : null;
        var delay = typeof(arg1) == 'number' && arg1 > 0 ? arg1 : 0;
        var action;
        if (loop == -1 || loop > 1) {
            if (loop == -1) {
                action = cc.RepeatForever.create(animate);
            } else {
                var actions = [];
                if (delay == 0 && !callback) {
                    actions.push(cc.Repeat.create(animate, loop));
                } else {
                    for (var i = 0; i < loop; i++) {
                        actions.push(animate.clone());
                        if (callback) {
                            actions.push(cc.CallFunc.create(callback));
                        }

                        if (i != loop - 1 && delay > 0) {
                            actions.push(cc.ToggleVisibility.create());
                            actions.push(cc.DelayTime.create(delay));
                            actions.push(cc.ToggleVisibility.create());
                        }
                    }
                }
                if (autoRelease) {
                    actions.push(cc.RemoveSelf.create());
                }
                action = cc.Sequence.create(actions);
            }
        } else {
            var actions = [animate];
            if (callback) {
                actions.push(cc.CallFunc.create(callback));
            }
            if (autoRelease) {
                actions.push(cc.RemoveSelf.create());
            }
            action = cc.Sequence.create(actions);
        }
        return action;
    },

    frames: function(fileName, nameFlag) {
        nameFlag = typeof(nameFlag) == 'string' ? nameFlag : '0';
        var padNum = nameFlag.length;
        var startIdx = parseInt(nameFlag);
        var endIdx = startIdx + 100;
        var frames = [];
        for (var i = startIdx; i < endIdx; i++) {
            var flag = i + '';
            if (flag.length < nameFlag.length) {
                flag = _.lpad(flag, nameFlag.length - flag.length, '0');
            }
            var frame = cc.spriteFrameCache.getSpriteFrame(fileName + "_" + flag + ".png");
            if (frame) {
                frames.push(frame);
            } else {
                break;
            }
        }
        if (frames.length == 0) {
            return null;
        }
        return frames;
    },

    particle: function(fileName, parent, autoRelease) {
        cc.spriteFrameCache.addSpriteFrames(plistName + '.plist');
        var node = cc.ParticleSystem.create(fileName);
        if (autoRelease) {
            node.setAutoRemoveOnFinish(true);
        }
        if (parent) {
            parent.addChild(node);
        }
        return node;
    },

    clip: function(mask, parent) {
        mask.setAnchorPoint(0, 0);
        mask.setPosition(0, 0);
        var clip = cc.ClippingNode.create();
        clip.setPosition(0, 0);
        clip.setStencil(mask);
        clip.setInverted(false);
        clip.setAlphaThreshold(0.05);
        clip.setContentSize(mask.getContentSize().width, mask.getContentSize().height);
        if (parent) {
            parent.addChild(clip);
        }
        return clip;
    }
}