function addModules() {
    var modules = {
        narration: function(modules, page) {
            var module = createNarration({
                moduleName: "NARRATION",
                box: amt.get(".narration", page),
                audioList: ["./media/audios/nkor_act_0201_01_0708_510.mp3"],
                sceneTimes: [
                    { start: 5, end: 17 },
                    { start: 17, end: 31 }
                ],
                textTimes: [
                    { start: 5, end: 9},
                    { start: 9, end: 13},
                    { start: 13, end: 17},
                    { start: 17, end: 22},
                    { start: 22, end: 26},
                    { start: 26, end: 100}
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
