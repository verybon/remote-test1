function addModules() {
    var modules = {
        narration: function(modules, page) {
            var module = createNarration({
                moduleName: "NARRATION",
                box: amt.get(".narration", page),
                audioList: ["./media/audios/nkpt_211_1.mp3"],
                sceneTimes: [
                    { start: 5, end: 10 },
                    { start: 10, end: 20 },
                    { start: 20, end: 30 }
                ],
                textTimes: [
                    { start: 5, end: 7},
                    { start: 7, end: 8},
                    { start: 8, end: 10},
                    { start: 10, end: 12},
                    { start: 12, end: 15},
                    { start: 15, end: 100}
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
