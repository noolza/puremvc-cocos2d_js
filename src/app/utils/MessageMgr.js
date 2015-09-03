
var MSG_APP_ENTERBACKGROUND         = "appEnterBackground";         //程序进入后台
var MSG_APP_ENTERFOREGROUND         = "appEnterForeground";         //程序调出

var MSG_PLAYER_UPDATE               = "player_info_update";         //玩家基本信息更新
var MSG_PLAYER_ITEM_UPDATE          = "player_items_update";        //道具列表更新
var MSG_PLAYER_MAILS_UPDATE         = "player_mails_update";        //消息更新
var MSG_PLAYER_GENERALS_UPDATE      = "player_generals_update";     //武将更新
var MSG_PLAYER_ACHIEVEMENTS_UPDATE  = "player_achievements_update"; //成就更新
var MSG_PLAYER_MISSIONS             = "player_mission_update";        //剧情有变化

var MSG_PLAYER_LIVENESS_UPDATE      = "player_liveness_update";     //活跃度更新
var MSG_PLAYER_SCORE_UPDATE         = "player_score_update";        //分数 或 排名更新
var MSG_UISHOW                      = "msg_uiShow";                 //窗口显示
var MSG_RECRUIT_SUCCESS             = "msg_recruit_success";        //武将招募成功


var MessageMgr = {
    msgTable: {},
    listen: function(msg, msgObj) {
        if(msg instanceof Array) {
            for(var i=0;i<msg.length;i++){
                this.bindMsg(msg[i],msgObj);
            }
            return;
        }

        if (msgObj === undefined || msgObj.onClientMsg == undefined) {
            throw new Error("[" + msg + "] onClientMsg() is undefined");
        }

        if (this.msgTable[msg] != null) {
            if (this.msgTable[msg].indexOf(msgObj) < 0) {
                if (this.msgTable[msg].length > 0)
                    cc.log("[MsgMgr] '" + msg + "' is a shared msg");
                this.msgTable[msg].push(msgObj);
                cc.log("[MsgMgr] '" + msg + "' " + this.msgTable[msg].join(","));
            }
        } else {
            this.msgTable[msg] = [msgObj];
            cc.log("[MsgMgr]bindNewMsg: " + msg + " obj: " + msgObj.mID);
        }
    },

    post: function(msg) {
        if (this.msgTable[msg] == null) {
            cc.log("[MsgMgr]没有对象注册此消息:" + msg);
            return;
        }
        var objs = this.msgTable[msg]
        for (i = 0; i < objs.length; i++) {
            cc.log("PosMsg: '" + msg + "'to: " + objs[i].mID);
            objs[i].onClientMsg.apply(objs[i], arguments);
        }
    },

    unbindMsg: function(msg, msgObj) {

        cc.log("[MsgMgr]unbindMsg: " + msg)
        if (msgObj == null)
            this.msgTable[msg] = null
        else {
            var objs = this.msgTable[msg]
            for (var i = 0; i < objs.length; i++) {
                if (objs[i] == msgObj) {
                    objs.splice(i, 1);
                    cc.log("[MsgMgr]MsgUnbind: " + msg + "-" + msgObj.mID);
                    return;
                }
            }
        }
    },
    
    unbindObj: function(obj) {
        for (var k in this.msgTable) {
            var objs = this.msgTable[k]
            if (objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    cc.log("[MsgMgr]" + objs[i].mID);
                    if (obj == objs[i]) {
                        objs.splice(i, 1);
                        cc.log("[MsgMgr]ObjUnbind:" + obj.mID);
                        break;
                    }
                }
            }
        }
    }
}
