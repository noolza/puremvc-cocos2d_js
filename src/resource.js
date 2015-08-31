var res = {
	imagePlist   : "res/sd_other/images.plist",
    image        : "res/sd_other/images.png",
    face        : "res/sd_other/face.png",
    sperm        : "res/sd_other/sperm.plist",
    spermpng     : "res/sd_other/sperm.png",
	mainScene    : "res/sd_other/mainScene.json",
    uiMain       : "res/sd_other/uiMain.json",
    uiGame       : "res/sd_other/uiGame.json",
    uiCustomFace : "res/sd_other/uiCustomFace.json",
    uiGamePause  : "res/sd_other/uiGamePause.json",
    uiGameOver   : "res/sd_other/uiGameOver.json",
    particle1    : "res/sd_other/piaofuwu_1.png",
    particle2    : "res/sd_other/piaofuwu_2.png",
    bgMusic      : "res/sd_other/zoidtrip.mp3",
    okWav        : "res/sd_other/Ok.wav",
    gameOverWav  : "res/sd_other/Gameover.wav",
    getWav       : "res/sd_other/Get.wav",
    ttf          : "res/sd_other/hanyimanbu.ttf",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
