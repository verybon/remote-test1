function addModules() {
    var modules = {
        narration: function(modules, page) {
            var module = createNarration({
                moduleName: "NARRATION",
                box: amt.get(".narration", page),
                audioList: ["./media/audios/nkor_act_0201_01_0506_510.mp3"],
                sceneTimes: [
                    { start: 5, end: 25 },
                    { start: 25, end: 30 },
                    { start: 30, end: 35 }
                ],
                textTimes: [
                    { start: 5, end: 10},
                    { start: 10, end: 15},
                    { start: 15, end: 20},
                    { start: 20, end: 25},
                    { start: 25, end: 30},
                    { start: 30, end: 100}
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
