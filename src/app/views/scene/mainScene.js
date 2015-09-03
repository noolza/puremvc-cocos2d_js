var mainScene = Class("mainScene", ViewBase)

mainScene.prototype.initOption = function() {
    this.setOption('mode', ViewBase.MODE_SCENE)
    this.setOption('showAction', 'sceneFade')
    this.setOption('bindUI', 'uiLog')
}

mainScene.prototype.onCreate = function() {
    this.randomColor();

    // this.particle.setPosition(cc.winSize.width/2, -5);
    this.delay = 0;
}

mainScene.prototype.fresh = function() {
    // body
    cc.log('mainScene fresh')

}

mainScene.prototype.onShown = function() {
    cc.log('mainScene onShown')

}

mainScene.prototype.randomColor = function() {

    // var bg = this.getChildByName('Panel_root');
    // bg.setColor(cc.color(0,0,0));
    // bg.setColor(cc.color(Rand(20, 255), Rand(20, 255), Rand(20, 255)));

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