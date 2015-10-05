
var ViewFactory = {
    // resPath : must end with '/'
    init: function(facade) {
        this.facade = facade;
        cc.BuilderReader.registerController('CCBProxy', {});
    },
    createView:function(id,isScene){
        var root = null;
        if(isScene){
            root = new cc.Scene();
            this.facade.runningScene = root;
        }
        var arr = id.split('_');
        var view = null;
        var classRef = puremvc.ClassManager[arr[0]];
        if (!classRef) {
            cc.log('[Warn]createView: view class not find: ' + arr[0]);
            view = new ViewBase(arr[0],root);
        } else {
            view = new classRef(arr[0],root);
        }
        this.facade.registerMediator(view);

        var component = this.createComponent(view);        
        view.setViewComponent(component);
        return view;
    },
    createComponent:function(view){
        var option = view.getOption();
        var resourceFile = option.getResourceFile();

        cc.log('resName: ' + resourceFile);

        var parent = view.getParent();

        var node = null;
        var component = null;

        if(option.resourceType == Const.UI_FILE_TYPE_JSON){
            node = this.loadCCS(Const.UI_FILE_JSON_PATH + resourceFile,view);
            component = new CCSComponent(view);
        } else {
            var parentSize = parent.getContentSize();
            cc.BuilderReader.setResourcePath(Const.UI_FILE_CCBI_PATH);
            node = this.loadCCBI(resourceFile,view,parentSize);
            component = new CCBComponent(view);
        }
        if (!node) {
            cc.warn('[createComponent]resourceFile not exist or read error ' + resourceFile);
            node = new cc.Node();
        } 

        node.setAnchorPoint(cc.p(0.5,0.5));
        node.setPosition(cc.p(cc.winSize.width/2,cc.winSize.height/2));
        component.addChild(node);
        LogNodesName(component);
        
        parent.addChild(component,option.getZOrder(),option.tag);
        return component;
    },
    loadCCBI : function (resourceFile , delegate, parentSize) {
        if (!parentSize || cc.sizeEqualToSize(parentSize, cc.SizeZero())) {
            parentSize = cc.winSize;
        }
        var readNode = null;
        if (jsb.fileUtils.isFileExist(resourceFile)) {

            readNode = cc.BuilderReader.load(resourceFile, delegate, parentSize);
            var ccbProxy = readNode.controller;
            for (var k in ccbProxy) {
                if (typeof(ccbProxy[k]) != 'function') {
                    delegate[k] = ccbProxy[k];
                }
            }
            var animationManager = readNode.animationManager;
            var documentCallbackNames = animationManager.getDocumentCallbackNames();
            var documentCallbackNodes = animationManager.getDocumentCallbackNodes();

            for (var i = 0; i < documentCallbackNames.length; i++) {
                var callbackName = documentCallbackNames[i];
                var callbackNode = documentCallbackNodes[i];

                if (delegate[callbackName] === undefined) {
                    cc.log("Warning: " + callbackName + " is undefined.");
                } else {
                    if (callbackNode instanceof cc.ControlButton) {
                        var documentCallbackControlEvents = animationManager.getDocumentCallbackControlEvents();
                        var btnEvent = function(sender, evt) {
                            return delegate[callbackName](sender, evt);
                        };
                        callbackNode.addTargetWithActionForControlEvents(delegate, btnEvent, documentCallbackControlEvents[i]);
                    } else {
                        callbackNode.setCallback(controller[callbackName], controller);
                    }
                }
            }
        }
        
        return readNode;
    },
    loadCCS : function(resourceFile,delegate) {
    
        var readObj = ccs.load(resourceFile);
        var readNode = readObj.node;
        
        if(readNode){
            this.bindEvent(readNode,delegate);   
        }
        return readNode; 
    }, 
    bindEvent : function(root, delegate) {
        var children = root.getChildren();
        for (var i = 0; i < children.length; i++) {
            if (children[i] instanceof ccui.Button && delegate.buttonClick) {
                children[i].addTouchEventListener(delegate.buttonClick, delegate);
            } else if (children[i] instanceof ccui.CheckBox && delegate.checkBoxEvent) {
                children[i].addEventListener(delegate.checkBoxEvent, delegate);
            } else if (children[i] instanceof ccui.Slider && delegate.valueChangedEvent) { // || children[i] instanceof ccui.LoadingBar)
                children[i].addEventListener(delegate.valueChangedEvent, delegate);
                children[i].addTouchEventListener(delegate.buttonClick, delegate);
            } else if (children[i] instanceof ccui.TextField && delegate.textInputEvent) {
                children[i].addTouchEventListener(delegate.textInputEvent, delegate);
            } else if (children[i] instanceof ccui.ScrollView) {
                if (delegate.scrollEvent) {
                    children[i].addEventListener(delegate.scrollEvent, delegate);
                }
                this.bindEvent(children[i], delegate);
            } else if (children[i] instanceof ccui.PageView) {
                if (delegate.onPageEvent) {
                    children[i].addEventListener(delegate.onPageEvent, delegate);
                }
                this.bindEvent(children[i], delegate);
            } else {
                this.bindEvent(children[i], delegate);
            }
        }
    }
};