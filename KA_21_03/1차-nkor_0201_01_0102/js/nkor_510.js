function addModules() {
    var modules = {
        narration: function(modules, page) {
            var module = createNarration({
                moduleName: "NARRATION",
                box: amt.get(".narration", page),
                audioList: ["./media/audios/nkor_0201_01_0102_510.mp3"],
                sceneTimes: [
                    { start: 5, end: 10 },
                    { start: 10, end: 14 },
                    { start: 14, end: 18 },
                    { start: 18, end: 20 }
                ],
                textTimes: [
                    { start: 5, end: 6},
                    { start: 6, end: 8},
                    { start: 8, end: 10},
                    { start: 10, end: 14},
                    { start: 14, end: 15},
                    { start: 15, end: 17},
                    { start: 17, end: 18},
                    { start: 18, end: 100}
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
