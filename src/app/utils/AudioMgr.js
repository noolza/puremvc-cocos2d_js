var AudioMgr = {

    res: "",
    isMusicOn: true,
    isEffectOn: true,
    lastBackgroundMusicFile: Const.MUSIC_MAIN, //初始化的背景音乐
    init: function() {
        this.isMusicOn = cc.sys.localStorage.getItem("MusicOn") != "off";
        this.isEffectOn = cc.sys.localStorage.getItem("EffectOn") != "off";
        // this.musicVolume = cc.sys.localStorage.getItem("MusicVolume") || 100;
        this.musicVolume = 100;
        cc.audioEngine.setMusicVolume(this.musicVolume / 100.0);
    },

    playBackgroundMusic: function(file) { //file参数如果不传，就播放上一次的背景音乐
        cc.log("this.isMusicOn:" + this.isMusicOn);

        var _file = file || lastBackgroundMusicFile
        lastBackgroundMusicFile = _file

        if (this.isMusicOn) {
            this.setMusicVolume(this.musicVolume, false);
            cc.audioEngine.playMusic(this.res + _file, true);
        }
    },

    pauseBackgroundMusic: function() {
        if (this.isMusicOn) {
            cc.audioEngine.pauseMusic();
        }
    },

    resumeBackgroundMusic: function() {
        if (this.isMusicOn)
            cc.audioEngine.resumeMusic();
    },

    setMusicVolume: function(volume, isSave) {
        isSave = isSave == undefined ? true : isSave; {
            cc.audioEngine.setMusicVolume(volume / 100.0);
            if (isSave) {
                cc.sys.localStorage.setItem("MusicVolume", volume);
                cc.log("save music vol");
            }
            this.musicVolume = volume;
        }
    },

    stopBackgroundMusic: function(v) {
        cc.audioEngine.stopMusic(v);
    },

    playEffect: function(file, loop) {
        if (!this.isEffectOn) return -1;

        if (loop == undefined) {
            loop = false;
        }
        var sID = cc.audioEngine.playEffect(this.res + file, loop);
        return sID;
    },

    stopEffect: function(sID) {
        cc.audioEngine.stopEffect(sID);
    },

    preloadEffect: function(file) {
        cc.audioEngine.preloadEffect(file);
    },

    unloadEffect: function(file) {
        cc.audioEngine.unloadEffect(file);
    }
};
