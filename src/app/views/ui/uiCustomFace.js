
var uiCustomFace = Class("uiCustomFace",ViewBase)

uiCustomFace.prototype.initOption = function(){
//	this.setOption('isClickClose',true)
}

uiCustomFace.prototype.onCreate = function(  ){
 	this.headImg = cc.Sprite.create('#LOGO.png');
 	this.headImg.setPosition(this.getChildByName('Panel_root/Image_face').getPosition());
 	this.addChild(this.headImg);
 // 	var canvas = document.getElementById("canvas"),
 //    	context = canvas.getContext("2d"),
 //    	video = document.getElementById("video"),
	//     videoObj = {
	//         "video": true
	//     },
 //    	errBack = function(error) {
 //        	console.log("Video capture error: ", error.code);
 //    	};
    
	// //navigator.getUserMedia这个写法在Opera中好像是navigator.getUserMedianow       
	// if (navigator.getUserMedia) {
	//     navigator.getUserMedia(videoObj, function(stream) {
	//         video.src = stream;
	//         video.play();
	//     }, errBack);
	// } else if (navigator.webkitGetUserMedia) {
	//     navigator.webkitGetUserMedia(videoObj, function(stream) {
	//         video.src = window.URL.createObjectURL(stream);
	//         video.play();
	//     }, errBack);
	// }
	// this.canvas = canvas;
 //    this.context = context;
 //    this.video = video;
 //    this.delay = 1;
}

uiCustomFace.prototype.onUpdate = function(dt){
	// this.delay -= dt;
	// if(this.delay<0){
	// 	this.delay = 1;
	// 	this.context.drawImage(this.video, 0, 0, 320, 320);
	// 	var imgData = this.canvas.toDataURL();
 //        //将图像转换为base64数据
 //        var base64Data = imgData.substr(22);
	// 	var img = this.headImg.getTexture();
	// 	img.initWithElement(this.video);
	// 	// this.headImg.loadTexture('customFace.png');
	// }

}

uiCustomFace.prototype.onShown = function(  ){
	cc.log('uiCustomFace onShown')

}

uiCustomFace.prototype.onClose = function(  ){
	// body

}

uiCustomFace.prototype.onRemoved = function(  ){
	// body
}

uiCustomFace.prototype.onButtonClick = function( sender ){
	if(sender.getName()=='Button_ok'){
		this.app.addView('uiMain')
	}
}

uiCustomFace.prototype.textInputEvent = function( sender,event ){
	cc.log(sender.name + event)
}
uiCustomFace.prototype.onTouchBegan = function(x,y){
	// cc.log("onTouchBegan. ", x,y)
	return true
}
uiCustomFace.prototype.onTouchMoved = function(x,y){
	// cc.log("onTouchMoved. ",x,y)
}
uiCustomFace.prototype.onTouchEnded = function(x,y){
	// cc.log("onTouchEnded. ",x,y)
}
