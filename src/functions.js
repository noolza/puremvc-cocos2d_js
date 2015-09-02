function Class(name,baseClass) {
    puremvc.ClassManager = puremvc.ClassManager || {};
    var classMgr = puremvc.ClassManager;
 
    if(classMgr[name]){
        throw new Error(name + ' class is exist');
    }

    function F() {

        if (!__initializing) {

            // 如果父类存在，则实例对象的baseprototype指向父类的原型
            // 这就提供了在实例对象中调用父类方法的途径

            if (baseClass) {
                this.super = baseClass.prototype;
            }

            baseClass.apply(this,arguments);
            this.NAME = name;
            if(this.ctor){
                this.ctor.apply(this, arguments);
            }
        }

    }

    if (baseClass) {
        __initializing = true;
        F.prototype = new baseClass();
        F.prototype.constructor = F;
        F.super = baseClass;
        __initializing = false;
    } 

    classMgr[name] = F;
    return F;
};

function Clone(obj)
{
	return JSON.parse(JSON.stringify(obj));
}

function Rand(min,max)
{
	return Math.round(Math.random()*100000000)%(max-min)+min;
}

function StringWithFormat(str)
{
    var result = str;
    for (var i=1; i < arguments.length; i++) {
        result = result.replace("@"+i, arguments[i]);
    }
    return result;
}


function StringJoinComma(v)
{
	return _.numberFormat(parseInt(v));
}

function alert(msg,opt)
{	
	var parent = opt&&opt.parent
	var pos = cc.p(0,0);
	
	if(opt&&opt.pos) pos = opt.pos;	
	else if(!parent){
		parent = cc.director.getRunningScene();
		var vsize  = cc.director.getVisibleSize();
		pos = cc.p(vsize.width/2,vsize.height/2);
	}
	
	var col    = opt&&opt.color||cc.color.RED;
	var fsize  = opt&&opt.size||32;
	
	var lbl = cc.LabelTTF.create(msg,FONT_TYPE,fsize);
	if(parent.addNode) 
		parent.addNode(lbl,10000);
	else
		parent.addChild(lbl,10000);
	lbl.setPosition(pos);
	lbl.setColor(col);
	
	var acts = [cc.DelayTime.create(0.3),cc.Spawn.create([cc.MoveTo.create(0.5,cc.p(pos.x,pos.y+80)),cc.FadeOut.create(0.5)]),cc.RemoveSelf.create()];
	lbl.runAction(cc.Sequence.create(acts));
}

function DeltaTimeToString(deltaTime, noNeedDetail) {
    var days = Math.floor(deltaTime / 86400);
    var hours = Math.floor(deltaTime % 86400 / 3600);
    var minutes = Math.floor(deltaTime % 3600 / 60);
    var seconds = Math.floor(deltaTime % 60);
    //cc.log(days + "d:" + hours + "h:" + minutes + "m:" + seconds + "s");

    if (noNeedDetail && deltaTime < 5 * 60) {
        return "< 5m";
    }
    if (days > 0) {
        return days + "d:" + intFillZero(hours) + "h";
    } else if (hours > 0) {
        return intFillZero(hours) + "h:" + intFillZero(minutes) + "m";
    } else {
        return intFillZero(minutes) + "m:" + intFillZero(seconds) + "s";
    }
}

function GetCurrentSecondsTime()
{
    return Math.floor(new Date().getTime() / 1000);
}

function DeltaTimeToChString(deltaTime,dim) {

    var hours = Math.floor(deltaTime / 3600);
    var minutes = Math.floor(deltaTime % 3600 / 60);
    var seconds = Math.floor(deltaTime % 60);
    if(seconds < 10) seconds = "0"+seconds;
    var result = "";

    if (hours > 0) {
        if(hours>=24){
            var day = Math.floor(hours/24);
            hours = hours%24;
            result += day + (dim || "天");
        }
        result += hours + (dim || "时");
    }
    if (minutes >= 0) {
        if(minutes < 10) minutes = "0"+minutes;
        result += minutes + (dim || "分");
    }
    result += seconds + (dim? "" : "秒");
    return result;
}
//Date必须为new Date()对象
//format为  yyyy-MM-dd hh:mm:ss 或则  自定义
function DateFormat(dateTime,format){ 
    format = format || "yyyy-MM-dd hh:mm:ss"
    var o = { 
        "M+" : dateTime.getMonth()+1, //月 
        "d+" : dateTime.getDate(), //天
        "h+" : dateTime.getHours(), //小时 
        "m+" : dateTime.getMinutes(), //分 
        "s+" : dateTime.getSeconds(), //秒 
        "q+" : Math.floor((dateTime.getMonth()+3)/3), //quarter 
        "S" : dateTime.getMilliseconds() //millisecond 
    } 

    if(/(y+)/.test(format)) { 
        format = format.replace(RegExp.$1, (dateTime.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    } 

    for(var k in o) { 
        if(new RegExp("("+ k +")").test(format)) { 
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
        } 
    } 
    return format; 
} 
function TimeFormat(deltaTime,format){ 
    format = format || "hh:mm:ss";
    var days  = Math.floor(deltaTime / 3600*24);
    var hours = Math.floor(deltaTime / 3600);
    var minutes = Math.floor(deltaTime % 3600 / 60);
    var seconds = Math.floor(deltaTime % 60);
    var o = { 
        "d+" : days, //小时 
        "h+" : hours, //小时 
        "m+" : minutes, //分 
        "s+" : seconds //秒 
    } 
    // if(hours <= 0){
    //     delete o["h+"];
    // }

    if(/(y+)/.test(format)) { 
        format = format.replace(RegExp.$1, (deltaTime.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    } 
    for(var k in o) { 
        if(new RegExp("("+ k +")").test(format)) { 
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
        } 
    } 
    return format; 
}

function LockScreen(isLock,who)
{
	
}

function GetText(textId) {
    var text = DataMgr.getData("texts",textId)["text"];
    if (arguments.length <= 1) return text;
    var args = [];
    for (var i=0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    args.splice(0, 1, text);
    return StringWithFormat.apply(text, args);
}

function SetLoadingBarWithAnimation(bar,to,from){
    if(!bar) return;
    if(!from) from = 0;
    to = Math.min(to,100);
    if(from > to) from = to;

    bar.setPercent(from);
    bar.stopActionByTag(10000);
    if(to == from) return;

    var act = cc.Sequence.create(cc.DelayTime.create(0.01),cc.CallFunc.create(function(node){
        SetLoadingBarWithAnimation(this,to,from + 15);
    },bar));
    act.setTag(10000);
    bar.runAction(act);
}   

//给当前label 赋值 附带动画 func每次数字变动都调用 参数是否结束 
function SetLabelStringWithAnimation(label,number,hasComma,preStr,callback){
    if(!label) return;

    if (!preStr) preStr = "";
    var setStringFunc = label.setString;
	var getStringFunc = label.getString;

    var str = number+"";
    var targetNumber = str.split(",").join("");

    var currentStr = getStringFunc.call(label);
    if(!currentStr){
        currentStr = "";
    } else {
        currentStr = currentStr.substr(preStr.length);
    }
    var currentNumber = currentStr.split(",").join("");
    if (!Number(currentNumber)){
        currentNumber = 0;
    }else{
        currentNumber = parseInt(currentNumber);
    }

    var gap = parseInt(targetNumber) - parseInt(currentNumber);

    if(gap==0){
        if(callback){
            callback(true);
        }
        return;
    }else{
        if(callback){
            callback(false);
        }
    }

    var labelString = currentNumber+Math.floor(gap/2);
    if(Math.abs(labelString-number)<=1){
        labelString = number;
    }

    if(hasComma){
        labelString = StringJoinComma(labelString);
    }
    setStringFunc.call(label,preStr+labelString);

    label.stopActionByTag(10000);

    var act = cc.Sequence.create(cc.DelayTime.create(0.05),cc.CallFunc.create(function(node){
        SetLabelStringWithAnimation(this,number,hasComma,preStr,callback);
    },label));
    act.setTag(10000);

    label.runAction(act);
	
}

function O2S(obj){
    //return "";
    return JSON.stringify(obj,null,2);
}

function GenerateAnimate(imgPreName, toIdx, fromIdx, startIdx, duration) {
    if (!duration) duration = 0.2;
    if (!fromIdx) fromIdx = 1;
    if (!startIdx) startIdx = 0;
    var list = [];
    for (var i = fromIdx; i <= toIdx; i++) {
        list.push(cc.spriteFrameCache.getSpriteFrame(imgPreName + (((i-fromIdx)+startIdx)%(toIdx-fromIdx+1)+fromIdx) + ".png"));
    }
    var animate = cc.Animate.create(cc.Animation.create(list, duration));
    return animate;
}

function GetNodeFindStr(node){
	var names = [node.getName()];
	var parent = node.getParent();
	while(parent){
		if(!parent.getName) break;
        var name = parent.getName();
        if(name == ''){
            name = TypeofNode(parent) + ':'+parent.getTag();
        }
		names.unshift(name);
		parent = parent.getParent();
	}
	names.splice(0,2);
	var res = names.join("/");
	cc.log(res);
	return res;
}

function TypeofNode (node) {
    return node.toString().replace('[object ','').replace(']','');
}
function LogNodesName(root) {
    var flag = false;
    if(root instanceof CCBComponent){
        cc.log("\n\n****************** [" + root.NAME + "] Nodes Names *****************\n")
        root = root.getRoot();
        flag = true;
    }
    var children = root.getChildren();
    if(!children) return;

    for (var i = 0; i < children.length; i++) {
        GetNodeFindStr(children[i]);
        LogNodesName(children[i]);
    };

    if(flag)
        cc.log("\n\n****************** Nodes Info *****************\n")
}

function GetArmature (name,autoPlay){
    autoPlay = autoPlay==undefined ? true:autoPlay;
    var armature = ccs.Armature.create(name);
    if(autoPlay){
        armature.getAnimation().playWithIndex(0,-1,-1);
    }
    return armature;
}

function PlayVideo(file,callback){
//    var scene = cc.director.getRunningScene();
//    scene.getEventDispatcher().setEnabled(false);
    
    if(cc.sys.os == cc.sys.OS_ANDROID){
        callback();
        return;
    }
    
    LockScreen(true,"play_video");
    var cb = function(){
        callback();
//        scene.getEventDispatcher().setEnabled(true);
         LockScreen(false,"play_video");
    }
    CPVideoPlayerManager.getInstance().play(file,cb);
}

function IsSameDay(date1,date2){
    if(date1.getFullYear() == date2.getFullYear() &&
       date1.getMonth() == date2.getMonth() &&
       date1.getDate() == date2.getDate()){
        return true;
    }
    return false;
}

function ScreenShot(callback){
    var fileName = "screenshot.jpg";
    var size = GetWinSize();
    var render = cc.RenderTexture.create(size.width,size.height,2,gl.DEPTH24_STENCIL8_OES);
    var pCurScene = cc.director.getRunningScene();
    render.begin();
    pCurScene.visit();
    render.end();
    render.saveToFile(fileName,true);
    pCurScene.runAction(cc.Sequence.create(cc.DelayTime.create(0.5),cc.CallFunc.create(callback)));
}
//分享
function ShareScreenShot(callback,type){
    type = type||Const.TENCENT_SHARE_TYPE_QQ_FRIEND;
    ScreenShot(function(){
       AuthManager.getInstance().shareMessage("果宝连萌","一款超赞的连线消除游戏！","screenshot.jpg",function(data){
            callback(JSON.parse(data));
        },type,Const.APP_DOWNLOAD_URL);
    })
}

//加密
function AESEncrypt(mes,code){
    return CryptoJS.AES.encrypt(mes, code).toString();
}
//解密
function AESDecrypt(mes,code){
    return CryptoJS.AES.decrypt(mes, code).toString(CryptoJS.enc.Utf8);
}

function isDebug(){
    return AuthManager.getInstance().isDebug();
}

function LocalNotifyRegister(){
    CPNotification.registerNotification();
}

function LocalNotifyCancel(){
    CPNotification.cancel();
}

function LocalNotify(mes,time){
    CPNotification.setNotifySound("/res/music/s_LeafDown.mp3");
    CPNotification.fire(mes,time);
}

function OnAppStoreBuyItem(res){
    var obj = JSON.parse(res);
    if(obj.error){
        UIMgr.hideUI("uiTextTip");
        UIMgr.add("uiWarning",obj.error);
    }else{
        AddAppStoreItem(obj);
        VerifyAppStoreReceipt(obj);
    }
}

//保存订单到本地
function AddAppStoreItem(obj){
    var parselr = GetLocalReceipts();
    parselr[obj.base64] = AESEncrypt(JSON.stringify(obj),"zhangqi");
    sys.localStorage.setItem("localReceipts",JSON.stringify(parselr));
}
//删除验证过的订单或者错误的订单
function RemoveAppStoreItem(base64){
    var parselr = GetLocalReceipts();
    delete parselr[base64];
    sys.localStorage.setItem("localReceipts",JSON.stringify(parselr));
}
//去服务器验证订单
function VerifyAppStoreReceipt(obj){
    cc.log("itemID:"+obj.itemID);
    cc.log("itemReceipt:"+obj.receipt);
    cc.log("receiptID:"+obj.receiptID);

    var list = DataMgr.getData("configs","exchange_diamond").value;
    var typeIndex = -1;
    for(var i = 0;i<list.length;i++){
        if(list[i].itemID==obj.itemID){
            typeIndex = i;
        }
    }
    
    UIMgr.add("uiTextTip","订单验证中，请稍等。。。");
    
    var sendData = NetWorkData.verifyReceipt("appstore",Const.ORDER_TYPE_GEM,typeIndex,obj.receiptID,obj.receipt,obj.base64);
    NetWork.send(sendData,function(res){
        UIMgr.hideUI("uiTextTip");
        if(res.error){
            if(res.error==160000||res.error==160002){
                UIMgr.add("uiWarning",res.errorInfo);
                RemoveAppStoreItem(obj.base64);
            }else{
                UIMgr.add("uiWarning",res.errorInfo);
            }
            return;
        }
        RemoveAppStoreItem(obj.base64);
        MainPlayer.resetData(res.result);
    })
}
//验证本地未完成验证的订单
function VerifyLocalReceipts(){
    if(PurcharseMgr.getInstance().getPurcharseSource()!=Const.ORDER_SOURCE_APPSTORE){
        return;
    }
    
    var parselr = GetLocalReceipts();
    var keys = _.keys(parselr);
    for(var i = 0;i<keys.length;i++){
        var obj = JSON.parse(AESDecrypt(parselr[keys[i]],"zhangqi"));
        VerifyAppStoreReceipt(obj);
    }
}
//获取本地的订单
function GetLocalReceipts(){
    var localReceipts = sys.localStorage.getItem("localReceipts");
    if(!localReceipts){
        localReceipts = "{}";
    }
    return JSON.parse(localReceipts);
}

//加载广告 不展示
function CreateBanner(){
    if(!Const.ENABLE_IAD_BANNER){
        return;
    }
    CPIADManager.getInstance().createBanner("2d0fbe68c9a6445d9031c615c9f872c8",1,1<<1,true);
}
//显示banner广告
function ShowBanner(){
    if(!Const.ENABLE_IAD_BANNER){
        return;
    }
    CPIADManager.getInstance().showBanner();
}
//隐藏bannner广告
function HideBanner(){
    if(!Const.ENABLE_IAD_BANNER){
        return;
    }
    CPIADManager.getInstance().hideBanner();
}
//刷新广告
function RefreshBanner(){
    if(!Const.ENABLE_IAD_BANNER){
        return;
    }
    CPIADManager.getInstance().refreshBanner();
}

//加载插屏广告
function LoadFullScreen(){
    if(!Const.ENABLE_IAD_FULL_SCREEN){
        return;
    }
    CPIADManager.getInstance().loadFullScreen("2d0fbe68c9a6445d9031c615c9f872c8",6);
}
//显示插屏广告
function ShowFullScreen(){
    if(!Const.ENABLE_IAD_FULL_SCREEN){
        return;
    }
    HideFullScreen();
    CPIADManager.getInstance().showFullScreen();
}
//关闭插屏广告
function HideFullScreen(){
    if(!Const.ENABLE_IAD_FULL_SCREEN){
        return;
    }
    CPIADManager.getInstance().hideFullScreen();
}

function RefreshFullScreen(){
    if(!Const.ENABLE_IAD_FULL_SCREEN){
        return;
    }
    CPIADManager.getInstance().refreshFullScreen();
}

function PlayTiliAnimation(target,callback){
    LockScreen(true,"tili_animation");
    var winSize = GetWinSize();
    var cfg = [
        cc.p(winSize.width/4*3,winSize.height/3*2),
        cc.p(winSize.width/2,winSize.height/4),
        target.getWorldPosition()
    ];

    var bezier = cc.BezierTo.create(1.0,cfg);
    var xin = cc.Sprite.create("#icon_tili.png");
    xin.setPosition(cc.p(30,winSize.height - 30));
    var seq = cc.Sequence.create([cc.ScaleTo.create(0.6,2),cc.ScaleTo.create(0.4,1),cc.CallFunc.create(function(){
        xin.setVisible(false);
        var baozha = GetArmature("donghua_tili",true);
        target.addChild(baozha);
        baozha.setPosition(target.width/2,target.height/2);
        baozha.getAnimation().setMovementEventCallFunc(function(arma,type,id){
            if(type === 1){
                LockScreen(false,"tili_animation");
                callback();
            }
        },null);

    })]);
    cc.director.getRunningScene().addChild(xin,1000);
    xin.runAction(cc.Spawn.create([bezier,seq]));
    MusicMgr.playEffect(SOUND_LEAF_DOWN);
}


function GetRand(min ,max){
    return math.random(min,max)
}

function GetLanguage(id){
    var lObj = Language[id]
    if(lObj == null){
        cc.log("language text not find :" + id)
        return id + " not find"
    }
    return Language[id][Const.Language]
}

function LockScreen(  ){
    // body
}

function FindNode( root,tag){
    if(root == null){ return null }
    if(root.getChildByTag == null){ return root }

    var node = root.getChildByTag(tag)
    if(node){ return node }

    var children = root.getChildren()
    if(children == null){ return null }
    for(i=0;i<root.getChildrenCount()-1; i++){
        node = FindNode(child,tag)
        if(node){ return node }
    }
    return null
}

// function ShowTag( dlg,filter ){
//     var children = dlg.dlgRoot.getChildren()
//     for(i=0,i<children.count()-1; i++)
//         var child = children.objectAtIndex(i)
//         var isBreak = true
//         if(filter){
//             child = tolua.cast(child,filter)
//             if(filter == "CCSprite" && child.setString){
//                 child = null
//             }
//         }

//         if(child && child.getContentSize){
//             var size = child.getContentSize()
//             var tag = child.getTag()
//             if(tag >= 0){
//                 var lbl = CCLabelTTF.create("[" + tag + "]","",20)
//                 lbl.setPosition(cc.p(child.getPositionX(),child.getPositionY()))
//                 lbl.setColor(cc.c3b(255,0,0))
//                 dlg.addChild(lbl,GL_Max,20000)
//             }
//         }
//     }
// }

function TTFGetFontNameAndSize(pFont){
    var pDesc = pFont.description();
    cc.log("TTFGetFontNameAndSize." + pDesc)
    var subs = split(",")
    var name = subs[1].split("=")[2]
    var font = subs[2].split("=")[2]
    return name,font
}

var RAND_MAX = 32767
function Random(){
    return math.random(0,RAND_MAX)
}

function AddRandColorAction(pNode){
    var arr = cc.Array.create()
    arr.addObject(CCTintTo.create(0.4, 255,  100, 100))
    arr.addObject(CCTintTo.create(0.4, 100,  255, 100))
    arr.addObject(CCTintTo.create(0.4, 100,  100, 255))
    pNode.runAction(CCRepeatForever.create(cc.Sequence.create(arr)))
}

