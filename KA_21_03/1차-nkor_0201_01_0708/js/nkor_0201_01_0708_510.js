function addModules() {
    var modules = {
        narration: function(modules, page) {
            var module = createNarration({
                moduleName: "NARRATION",
                box: amt.get(".narration", page),
                audioList: ["./media/audios/nkor_0201_01_0708_510.mp3"],
                sceneTimes: [
                    { start: 5, end: 17 },
                    { start: 17, end: 24 }
                ],
                textTimes: [
                    { start: 5, end: 8},
                    { start: 8, end: 11},
                    { start: 11, end: 13},
                    { start: 13, end: 17},
                    { start: 17, end: 19},
                    { start: 19, end: 21},
                    { start: 21, end: 22},
                    { start: 22, end: 100}
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
