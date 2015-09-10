var mainScene = Class("mainScene", ViewBase)

mainScene.prototype.initOption = function() {
    this.setOption('mode', ViewOption.MODE_SCENE)
    // this.setOption('showAction', 'sceneFade')
    this.setOption('bindUI', 'uiLog')
}

mainScene.prototype.onCreate = function() {
    
}

mainScene.prototype.fresh = function() {
    cc.log('mainScene fresh')
}

mainScene.prototype.onShown = function() {
    cc.log('mainScene onShown')
}

// mainScene.prototype.onUpdate = function( dt ){
// }

mainScene.prototype.onRemoved = function() {
    // body
}

mainScene.prototype.onTouchBegan = function(x, y) {
    cc.log("onTouchBegan. ", x, y)
    return true
}
// mainScene.prototype.onTouchMoved = function(x, y) {
//     cc.log("onTouchMoved. ", x, y)
// }
// mainScene.prototype.onTouchEnded = function(x, y) {
//     cc.log("onTouchEnded. ", x, y)
// }