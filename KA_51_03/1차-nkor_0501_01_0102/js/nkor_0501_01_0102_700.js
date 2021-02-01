function addModules() {
    var modules = {
        video: function(modules, page) {
            var module = createVideoContent({
                moduleName: "VIDEO_CONTENT",
                box: page,
                src: "./media/videos/nkor_0501_01_0102_700.mp4",
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}
