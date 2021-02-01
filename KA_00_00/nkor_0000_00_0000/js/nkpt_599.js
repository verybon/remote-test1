function addModules() {
    var modules = {
        song: function(modules, page) {
            var module = createSong({
                moduleName: "SONG",
                box: amt.get(".song", page),
                audioList: ["./media/audios/nkor_0102_04_0506_600_AR.mp3", "./media/audios/nkor_0102_04_0506_600_MR.mp3"],
                sceneTimes: [
                    { start: 1, end: 20.5 },
                    { start: 20.5, end: 35 },
                    { start: 35, end: 53 },
                    { start: 53, end: 70 },
                    { start: 70, end: 84 },
                    { start: 84, end: 200 }
                ],
                textTimes: [
                    { start: 7, end: 14},
                    { start: 14, end: 20.5},

                    { start: 21, end: 28},
                    { start: 28, end: 31.5},
                    { start: 31.5, end: 35},

                    { start: 35, end: 42},
                    { start: 42, end: 48},

                    { start: 56, end: 63},
                    { start: 63, end: 70},

                    { start: 70, end: 77},
                    { start: 77, end: 80.5},
                    { start: 80.5, end: 84},

                    { start: 84, end: 91},
                    { start: 91, end: 98},
                    { start: 98, end: 200}
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
