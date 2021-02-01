
function addModules() {
    var modules = {
        cutAni: function(modules, page) {
            var module = createCutAnimation({
                moduleName: "CUT_ANIMATION",
                box: page,
                audioList: ["./media/audios/nkor_0501_01_0708_510.mp3"],
                cutTimes: [
                    { start: 5, end: 10 },
                    { start: 10, end: 20 },
                    { start: 20, end: 24 },
                    { start: 24, end: 38 },
                    { start: 38, end: 51 },
                    { start: 51, end: 100 }
                ],
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
