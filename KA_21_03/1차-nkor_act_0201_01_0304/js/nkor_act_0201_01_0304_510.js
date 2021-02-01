function addModules() {
    var modules = {
        narration: function(modules, page) {
            var module = createNarration({
                moduleName: "NARRATION",
                box: amt.get(".narration", page),
                audioList: ["./media/audios/nkor_act_0201_01_0304_510.mp3"],
                sceneTimes: [
                    { start: 5, end: 9 },
                    { start: 9, end: 15 },
                    { start: 15, end: 21 }
                ],
                textTimes: [
                    { start: 5, end: 6},
                    { start: 6, end: 7},
                    { start: 7, end: 9},
                    { start: 9, end: 11},
                    { start: 11, end: 15},
                    { start: 15, end: 18},
                    { start: 18, end: 100}
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
