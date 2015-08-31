//
// CocosBuilder extend
//

cc.BuilderReader = cc.BuilderReader || {};

//modified by tuyoo
// 修改代码，使得ccb的controller不是通过全局变量来找到，而是直接传入的，这样可以方便进行基础架构的oop封装
// 第二个参数是控制器的构造函数
cc.BuilderReader.loadWithController = function(file, controller, owner, parentSize) {
    cc.log('loadWithController, ccbi name - ' + file + ' and controller is ' + controller);
    // Load the node graph using the correct function
    var reader = cc._Reader.create();
    reader.setCCBRootPath(cc.BuilderReader._resourcePath);

    var node;

    if (parentSize) {
        // 参数依次是ccb文件名，c++里面的owner，要放入的父节点的大小(默认父节点是整个屏幕大小),所以owner只能是null
        node = reader.load(file, null, parentSize);
    } else {
        node = reader.load(file);
    }

    // Assign owner callbacks & member variables
    if (owner) {
        // Callbacks
        var ownerCallbackNames = reader.getOwnerCallbackNames();
        var ownerCallbackNodes = reader.getOwnerCallbackNodes();

        for (var i = 0; i < ownerCallbackNames.length; i++) {
            var callbackName = ownerCallbackNames[i];
            var callbackNode = ownerCallbackNodes[i];

            if (owner[callbackName] === undefined) {
                cc.log("Warning: " + "owner." + callbackName + " is undefined.");
            } else {
                if (callbackNode instanceof cc.ControlButton) {
                    var ownerCallbackControlEvents = reader.getOwnerCallbackControlEvents();
                    var btnEvent = function(sender,evt){
                        return controller[callbackName](sender,evt);
                    }
                    callbackNode.addTargetWithActionForControlEvents(owner, btnEvent, ownerCallbackControlEvents[i]);
                } else {
                    callbackNode.setCallback(owner[callbackName], owner);
                }
            }
        }

        // Variables
        var ownerOutletNames = reader.getOwnerOutletNames();
        var ownerOutletNodes = reader.getOwnerOutletNodes();

        for (var i = 0; i < ownerOutletNames.length; i++) {
            var outletName = ownerOutletNames[i];
            var outletNode = ownerOutletNodes[i];

            owner[outletName] = outletNode;
        }
    }

    var nodesWithAnimationManagers = reader.getNodesWithAnimationManagers();
    var animationManagersForNodes = reader.getAnimationManagersForNodes();
    cc.log('nodesWithAnimationManagers length is ' + nodesWithAnimationManagers.length);
    
    // Attach animation managers to nodes and assign root node callbacks and member variables
    for (var i = 0; i < nodesWithAnimationManagers.length; i++) {
        var innerNode = nodesWithAnimationManagers[i];
        var animationManager = animationManagersForNodes[i];

        innerNode.animationManager = animationManager;

        // 这个名字是在ccb中右上角设置的js controller的名字（string类型）
        // var documentControllerName = animationManager.getDocumentControllerName();
        // if (!documentControllerName) {
        //     cc.log('documentControllerName is null, continue...');
        //     continue;
        // }

        // Create a document controller，需要做一个全局的 类名字到构造函数 的映射，默认的是使用全局变量名就好
        // var controller = new puremvc.ClassManager[documentControllerName]();
        // var controller = new controllerConstrutor();
        // controllerConstrutor
        // controller.controllerName = documentControllerName;
        
        // controller.animationManager = animationManager;
        // innerNode.controller = controller;
        // controller.rootNode = innerNode;

        // Callbacks
        var documentCallbackNames = animationManager.getDocumentCallbackNames();
        var documentCallbackNodes = animationManager.getDocumentCallbackNodes();

        for (var j = 0; j < documentCallbackNames.length; j++) {
            var callbackName = documentCallbackNames[j];
            var callbackNode = documentCallbackNodes[j];

            if (controller[callbackName] === undefined) {
                cc.log("Warning: " + controller.NAME + "." + callbackName + " is undefined.");
            } else {
                if (callbackNode instanceof cc.ControlButton) {
                    var documentCallbackControlEvents = animationManager.getDocumentCallbackControlEvents();
                    var btnEvent = function(sender,evt){
                        return controller[callbackName](sender,evt);
                    }
                    callbackNode.addTargetWithActionForControlEvents(controller, btnEvent, documentCallbackControlEvents[j]);
                } else {
                    callbackNode.setCallback(controller[callbackName], controller);
                }
            }
        }

        // Variables， 这个要求设置时是设置为 root document的范围
        var documentOutletNames = animationManager.getDocumentOutletNames();
        var documentOutletNodes = animationManager.getDocumentOutletNodes();

        for (var j = 0; j < documentOutletNames.length; j++) {
            var outletName = documentOutletNames[j];
            var outletNode = documentOutletNodes[j];

            controller[outletName] = outletNode;
            cc.log('root var :' + outletName);
        }

        if (typeof(controller.onDidLoadFromCCB) == "function") {
            controller.onDidLoadFromCCB();
        }

        // Setup timeline callbacks 处理callback这个channel
        var keyframeCallbacks = animationManager.getKeyframeCallbacks();
        for (var j = 0; j < keyframeCallbacks.length; j++) {
            var callbackSplit = keyframeCallbacks[j].split(":");
            var callbackType = callbackSplit[0];
            var callbackName = callbackSplit[1];
            //doc or owner callback
            if (callbackType == 1) {
                var callfunc = cc.CallFunc.create(controller[callbackName], controller);
                animationManager.setCallFunc(callfunc, keyframeCallbacks[j]);
            } else if (callbackType == 2 && owner) {
                var callfunc = cc.CallFunc.create(owner[callbackName], owner);
                animationManager.setCallFunc(callfunc, keyframeCallbacks[j]);
            }
        }

        // Start animation
        var autoPlaySeqId = animationManager.getAutoPlaySequenceId();
        if (autoPlaySeqId != -1) {
            animationManager.runAnimationsForSequenceIdTweenDuration(autoPlaySeqId, 0);
        }
    }
    controller.animationManager = animationManagersForNodes.shift();
    controller.animationManagers = animationManagersForNodes;

    return node;
};
