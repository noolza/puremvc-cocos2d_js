var ViewFactory = {
    createView: function(id, parent) {
        var root = null;

        var arr = id.split('-');
        var view = null;
        var classRef = puremvc.ClassManager[arr[0]];
        if (!classRef) {
            cc.log('[Warn]createView: view class not find: ' + arr[0]);
            view = new ViewBase(arr[0], parent);
        } else {
            view = new classRef(arr[0], parent);
        }
        // var option = view.getOption();
        // var resourceFile = option.getResourceFile();
        // var component = this.createComponent(resourceFile,parent,view);
        // view.setViewComponent(component);
        return view;
    },
    createComponent: function(resourceFile,parent,delegate) {
        
        var resourceType = resourceFile.indexOf('.json') >= 0 ? Const.UI_FILE_TYPE_JSON : Const.UI_FILE_TYPE_CCBI;
        cc.log('[createComponent] resName: ' + resourceFile);

        var node = null;
        var component = null;

        if (resourceType == Const.UI_FILE_TYPE_JSON) {
            node = this.loadJson(Const.UI_FILE_JSON_PATH + resourceFile, delegate);
            component = new CCSComponent(delegate);
        } else {
            var parentSize = parent != null ? parent.getContentSize() : cc.winSize;
            cc.BuilderReader.setResourcePath(Const.UI_FILE_CCBI_PATH);
            node = this.loadCCBI(resourceFile, delegate, parentSize);
            component = new CCBComponent(delegate);
        }
        if (!node) {
            cc.warn('[createComponent]resourceFile not exist or read error ' + resourceFile);
            node = new cc.Node();
        }

        component.addChild(node);
        LogNodesName(component);
        return component;
    },
    loadCCBI: function(resourceFile, delegate, parentSize) {
        if (!parentSize || cc.sizeEqualToSize(parentSize, cc.SizeZero())) {
            parentSize = cc.winSize;
        }
        if (!cc.BuilderReader.controllerClassCache['CCBProxy']) {
            cc.BuilderReader.registerController('CCBProxy', {});
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

    loadJson: function(resourceFile, delegate) {

        var readObj = ccs.load(resourceFile);
        var readNode = readObj.node;

        if (readNode) {
            this.bindEvent(readNode, delegate);
        }
        return readNode;
    },

    bindEvent: function(root, delegate) {
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