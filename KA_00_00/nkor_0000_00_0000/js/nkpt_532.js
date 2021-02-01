function addModules() {
    var modules = {
        video: function(modules, page) {
            var module = createVideoContent({
                moduleName: "VIDEO_CONTENT",
                box: page,
                src: "./media/videos/nkpt_531.mp4",
                sceneTimes: [
                    { start: 1, end: 24 },
                    { start: 24, end: 41 },
                    { start: 41, end: 66 },
                    { start: 66, end: 85 },
                    { start: 85, end: 1000 }
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
