function addModules() {
    var modules = {
        narration: function(modules, page) {
            var module = createNarration({
                moduleName: "NARRATION",
                box: amt.get(".narration", page),
                audioList: ["./media/audios/nkor_0201_01_0506_510.mp3"],
                sceneTimes: [
                    { start: 5, end: 11 },
                    { start: 11, end: 17 },
                    { start: 17, end: 25 }
                ],
                textTimes: [
                    { start: 5, end: 8},
                    { start: 8, end: 11},
                    { start: 11, end: 13},
                    { start: 13, end: 15},
                    { start: 15, end: 17},
                    { start: 17, end: 21},
                    { start: 21, end: 100},
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
