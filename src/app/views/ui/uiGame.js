
var uiGame = Class("uiGame",ViewBase)

uiGame.prototype.initOptions = function(){
//	this.setOption('isClickClose',true)
}

uiGame.prototype.onCreate = function(  ){
    AudioMgr.playBackgroundMusic(res.bgMusic);
	
	this.app.getView('mainScene').randomColor();

	this.sperm = this.getChildByName('Panel_root/sperm');
	this.tail  = this.sperm.getChildByName('sperm_tail');
	this.tail.runAction(AnimationMgr.frames('sperm',true,0.05));

	this.scoreLbl = this.getChildByName('Panel_root/Text_score');

	// this.sperm.setRotation(-45);
	this.startPos = cc.p(this.sperm.width,cc.winSize.height - 200);

	this.sperm.setPosition(this.startPos);
	this.sperm.setCascadeOpacityEnabled(true);
	// this.addChild(this.sperm);

	this.score = 0;
	this.spermSpeed = 6;
	this.wallSpeed = 300;
	this.angle = -1;
	this.isPause = false;

	this.tailOffsetY = 47;
	this.followSpeed = 5;
	this.walls = [];

	this.createWalls();
}

uiGame.prototype.onUpdate = function( dt ){
	if(this.isPause || this.walls.length == 0) return;
	
	var currentWall = this.walls[0];
	this.isPause = this.hitTest(currentWall);
	if(this.isPause){
		this.die();
		return;
	} 

	this.startPos.x += -1*this.angle*this.spermSpeed;
	var spermHeight = this.sperm.height*this.sperm.getAnchorPoint().y;
	if(this.startPos.y > cc.winSize.height - 300 + spermHeight){
		this.startPos.y += -1*this.spermSpeed;
	} else {
		this.startPos.y = cc.winSize.height - 300 + spermHeight;
	}

	this.sperm.setPosition(this.startPos);
	this.followAngle(this.sperm,12);
	if(this.tail.rotation != 0){		
		if(Math.abs(this.tail.rotation) < 3){
			this.tail.rotation = 0;
		} else{
			this.tail.rotation += this.angle * 3;
		}
	}

	this.wallRoot.y += this.wallSpeed*dt;
	
}

uiGame.prototype.followAngle = function(node,speed){
	if(node.rotation != this.angle*45){
		var rot = node.rotation + this.angle * speed;
		if(Math.abs(rot) > 45){
			rot = this.angle*45;
		}
		node.rotation = rot;
	}
}

uiGame.prototype.hitTest = function(currentWall){
	if(this.startPos.x < 0 || this.startPos.x > cc.winSize.width){
		return true;
	}

	var curpos = currentWall.getWorldPosition();
	var wallTopPosY = curpos.y + currentWall.height/2
	if(wallTopPosY >= cc.winSize.height - 300){
		var wallL =  currentWall.getChildByName('Image_wall_0');
		var wallR =  currentWall.getChildByName('Image_wall_1');
		// var rectLeft = cc.rect(wallL.getWorldPosition().x - wallL.width/2 ,wallL.getWorldPosition().y - wallL.height/2,wallL.width,wallL.height);
		// var rectRight = cc.rect(wallR.getWorldPosition().x - wallR.width/2,wallR.getWorldPosition().y - wallR.height/2,wallR.width,wallR.height);
		var rectLeft = wallL.getBoundingBoxToWorld();
		var rectRight = wallR.getBoundingBoxToWorld();
		for(var i=0;i<5;i++){
			var helpPoint = this.sperm.getChildByName('help_'+i)
			var pos = this.sperm.convertToWorldSpace(helpPoint.getPosition()) ;
			if(cc.rectContainsPoint(rectLeft,pos)||cc.rectContainsPoint(rectRight,pos)){
				// this.debug(rectLeft,rectRight,pos);
				return true;
				// this.app.addView('uiGameOver',this.score);
				// break;
			}
		}

		if(curpos.y > cc.winSize.height - 300 + this.sperm.height/2){
			this.walls.shift();
			this.score++;
			this.scoreLbl.setString(this.score+'');
			cc.log(this.score + ' ==')
	        AudioMgr.playEffect(res.getWav);
		}
	}
	return false;
}

uiGame.prototype.debug = function(rectLeft,rectRight,pos){
	var l = cc.LayerColor.create(cc.color(200,50,100,100),rectLeft.width,rectLeft.height);
	this.addChild(l);

	l.setPosition(rectLeft.x ,rectLeft.y );

	l = cc.LayerColor.create(cc.color(200,50,100,100),rectRight.width,rectRight.height);
	this.addChild(l);
	l.setPosition(rectRight.x ,rectRight.y );

	l = cc.LayerColor.create(cc.color(200,50,100,100),15,15);
	this.addChild(l);
	l.setPosition(pos);

	for(var i=0;i<3;i++){
		var helpPoint = this.sperm.getChildByName('help_'+i)
		l = cc.LayerColor.create(cc.color(100,200,50,100),10,10);
		this.sperm.addChild(l);
		l.setPosition(helpPoint.getPosition());
	}
}
uiGame.prototype.die = function(){
	
	var targetPos = this.angle < 0 ? cc.p(this.sperm.x + 100,cc.winSize.height) : cc.p(this.sperm.x - 100,cc.winSize.height);
	
	var moveTo = cc.EaseOut.create(cc.MoveTo.create(2,targetPos),2);
	var spawn = cc.Spawn.create(moveTo,cc.RotateBy.create(2,90),cc.FadeTo.create(2,0));
	var self = this;
	this.sperm.runAction(cc.Sequence.create(spawn,cc.CallFunc.create(function(){
		self.app.addView('uiGameOver',self.score);
	})));
	this.tail.stopAllActions();
	this.tail.setRotation(0);

	AudioMgr.stopBackgroundMusic(res.bgMusic);
	AudioMgr.playEffect(res.gameOverWav);
}

uiGame.prototype.createWalls = function(){
	// 前10个固定的～11到20里有两个随机动的～21到28是固定的大块～29到40有三个随机动的～41到50是大块随机动的
	var WallConfig = {
		0:{'img':0},
		9:{'img':1},
		10:{'img':0},
		19:{'img':1},
		20:{'img':0,offsetX:50,height:150},
		21:{'img':0,offsetY:20,height:150},
		25:{'img':0,offsetY:300},
		30:{'img':0},
		32:{'img':1},
		33:{'img':0,},
		34:{'img':1},
		35:{'img':0},
		36:{'img':1},
		37:{'img':0},
		40:{'img':1,offsetX:50,height:150},
		41:{'img':1,offsetX:50,offsetY:20,height:150},
	}
	var wall = this.getChildByName('Panel_root/Panel_wall');
	var lastCfg = {};
	var root = new cc.Layer();
	this.addChild(root);

	var posY = 300;
	for(var i=0;i<50;i++){
		if(WallConfig[i]){
			lastCfg = WallConfig[i];
		}
		var offsetY = lastCfg.offsetY || 300;
		var offsetX = lastCfg.offsetX || 240;
		posY -= offsetY

		var newWall = wall.clone();
		newWall.setVisible(true);
		newWall.y = posY;
		this.walls.push(newWall);

		var wall0 = newWall.getChildByName('Image_wall_0');
		var wall1 = newWall.getChildByName('Image_wall_1');

		if(lastCfg.height){
			newWall.height = lastCfg.height;
			wall0.height = lastCfg.height;
			wall1.height = lastCfg.height;
			posY -= lastCfg.height;
		} else {
			newWall.x = Rand(-wall0.width/2,wall0.width/2-5);
			// if(wall0.width/2 - Math.abs(newWall.x)< 20){
			// 	newWall.x = newWall.x>0 ? wall0.width/2-10 : -wall0.width/2+10;
			// }		
		}

		if(lastCfg.img == 1){
			wall0.loadTexture('zudangwu_2.png',ccui.Widget.PLIST_TEXTURE);
			wall1.loadTexture('zudangwu_2.png',ccui.Widget.PLIST_TEXTURE);

			// var randx = Rand(-wall0.width/2,wall0.width/2);
			// var moveTo = cc.MoveTo.create(10,cc.p(randx,posY));
			// var moveTo0 = cc.MoveTo.create(10,cc.p(newWall.x,posY));
			var moveTo = cc.MoveTo.create(10,cc.p(-wall0.width/2+10,posY));
			var moveTo0 = cc.MoveTo.create(10,cc.p(wall0.width/2-10,posY));
			newWall.runAction(cc.RepeatForever.create(cc.Sequence.create(moveTo,moveTo0)));
		}

		root.addChild(newWall);
	}	
	posY -= cc.winSize.height + 300;
	this.wallRoot = root;
	this.distance = -posY;
}

uiGame.prototype.play = function(  ){
	this.isPause = false;
}

uiGame.prototype.onRemoved = function(  ){
	// body
}

uiGame.prototype.onButtonClick = function( sender ){
	if(sender.getName()=='Button_pause'){
		this.app.addView('uiGamePause');
		this.isPause = true;
	}
}

uiGame.prototype.onTouchBegan = function(x,y){
	// cc.log("onTouchBegan. ", x,y)
	this.tail.rotation = this.angle*45;
	this.angle*=-1;

	// this.sperm.setRotation(45*this.angle);

	return true
}
uiGame.prototype.onTouchMoved = function(x,y){
	// cc.log("onTouchMoved. ",x,y)
}
uiGame.prototype.onTouchEnded = function(x,y){
	// cc.log("onTouchEnded. ",x,y)
}
