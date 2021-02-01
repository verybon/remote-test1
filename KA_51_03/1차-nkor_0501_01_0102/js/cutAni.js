function addModules() {
    var modules = {
        cutAni: function (modules, page) {
            var module = createCutAnimation({
                moduleName: "CUT_ANIMATION",
                box: page,
                audioList: ["./media/audios/nkpt_211_1.mp3"],
                cutTimes: [
                    { start: 5, end: 10 },
                    { start: 11, end: 15 },
                    { start: 16, end: 20 },
                    { start: 21, end: 26 },
                    { start: 27, end: 32 }
                ],
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
