var createAudioPlayer = function (spec) {
    var exporter = _.extend(baseModule());
    var box;

    var playButton;
    var stopButton;
    var muteButton;
    var pauseButton;
    var progressBar;
    var timeDisplay;
    var currentTime;
    var durationTime;

    var progress;

    var loopID;

    var audio = new Audio;
    var audioList;

    var callbacks = {};

    var template = '\
        <div class="controller">\
            <div class="progress-bar">\
                <div class="background">\
                    <div class="played"></div>\
                </div>\
                <div class="bar"></div>\
            </div>\
            <div class="time-display">\
                <div class="current-time"></div>\
                <div class="duration-time"></div>\
            </div>\
            <div class="play-button"></div>\
            <div class="pause-button"></div>\
            <div class="stop-button"></div>\
            <div class="mute-button"></div>\
        </div>\
    ';

    exporter.name = spec.moduleName;

    init();

    function init() {
        if (typeof spec.box === 'string') {
            box = amt.get(spec.box);
        } else {
            box = spec.box;
        }
        box.innerHTML = template;

        if(spec.hasOwnProperty("callbacks")) {
            // callbacks = spec.callbacks;
            for(var attr in spec.callbacks) {
                callbacks[attr] = spec.callbacks[attr];
            }
        }

        // audioList = box.dataset.list.split(",");
        audioList = spec.audioList;
        // console.log("list :: ", audioList);
        audio.src = audioList[0];

        playButton = amt.get(".play-button", box);
        stopButton = amt.get(".stop-button", box);
        muteButton = amt.get(".mute-button", box);
        pauseButton = amt.get(".pause-button", box);
        progressBar = amt.get(".progress-bar", box);
        timeDisplay = amt.get(".time-display", box);
        currentTime = amt.get(".current-time", timeDisplay);
        durationTime = amt.get(".duration-time", timeDisplay);

        pauseButton.style.display = "none";

        currentTime.innerHTML = "00:00";
        durationTime.innerHTML = "00:00";

        progress = createProgressBar({
            box: amt.get(".progress-bar", box)
        });

        box.addEventListener(amt.mouseTouchEvent.click, hnClick);
        box.addEventListener(amt.mouseTouchEvent.over, hnOver);
        box.addEventListener(amt.mouseTouchEvent.out, hnOut);

        audio.addEventListener("play", audioPlayed);
        audio.addEventListener("pause", audioPaused);
        audio.addEventListener("ended", audioEnded);
        // audio.addEventListener("seeked", videoSeeked);
        // audio.addEventListener("timeupdate", videoTimeUpdate);
        audio.addEventListener("loadedmetadata", audioMetaData);

        progressBar.addEventListener("SCROLL_BAR", hnProgress);
    }

    function hnProgress(e) {
        if (audio.readyState === 0) return;
        if (e.detail.percent === 1) {
            stop();
            return;
        }
        var time = audio.duration * e.detail.percent;
        audio.currentTime = time;
    }

    function audioMetaData(e) {
        updateCurrentTime(0);
    }

    function audioPlayed(e) {
        playButton.style.display = "none";
        pauseButton.style.display = "";
        loop();
    }

    function audioPaused(e) {
        playButton.style.display = "";
        pauseButton.style.display = "none";
        cancelAnimationFrame(loopID);
    }

    function audioEnded(e) {
        stop();
    }

    function audioSeeked(e) {}

    function audioTimeUpdate(e) {}

    function loop() {
        loopID = requestAnimationFrame(loop);
        updateControl();
    }

    function updateControl() {
        var duration = audio.duration;
        var current = audio.currentTime;
        progress.setPercent(current / duration);
        updateCurrentTime(audio.currentTime);
        if(callbacks.loop) {
            callbacks.loop(current);
        }
    }

    function updateCurrentTime(time) {
        var duration = audio.duration;
        if (isNaN(duration)) {
            duration = 0;
        }
        var curmins = Math.floor(time / 60);
        var cursecs = Math.floor(time - curmins * 60);
        var durmins = Math.floor(duration / 60);
        var dursecs = Math.floor(duration - durmins * 60);
        if (cursecs < 10) {
            cursecs = "0" + cursecs;
        }
        if (dursecs < 10) {
            dursecs = "0" + dursecs;
        }
        if (curmins < 10) {
            curmins = "0" + curmins;
        }
        if (durmins < 10) {
            durmins = "0" + durmins;
        }
        currentTime.innerHTML = curmins + ":" + cursecs;
        durationTime.innerHTML = durmins + ":" + dursecs;
    }

    function hnClick(e) {
        var target = e.target;
        // console.log(target);
        switch (target) {
            case playButton:
                play();
                break;
            case pauseButton:
                pause();
                break;
            case stopButton:
                stop();
                break;
            case muteButton:
                if (target.classList.contains("on")) {
                    unmute();
                } else {
                    mute();
                }
                target.classList.toggle("on");
                break;
        }
    }

    function hnOver(e) {
        var target = e.target;
        switch (target) {
            case playButton:
            case pauseButton:
            case stopButton:
            case muteButton:
                target.classList.add("over");
                break;
        }
    }

    function hnOut(e) {
        var target = e.target;
        switch (target) {
            case playButton:
            case pauseButton:
            case stopButton:
            case muteButton:
                target.classList.remove("over");
                break;
        }
    }

    function play() {
        audio.play();

        if(callbacks.play) {
            callbacks.play();
        }
    }

    function pause() {
        audio.pause();

        if(callbacks.pause) {
            callbacks.pause();
        }
    }

    function stop() {
        if (audio.readyState > 0) {
            audio.pause();
            audio.currentTime = 0;
        }
        progress.resetScroll();
        updateCurrentTime(0);

        if(callbacks.stop) {
            callbacks.stop();
        }
    }

    function mute() {
        audio.muted = true;
    }

    function unmute() {
        audio.muted = false;
    }

    exporter.start = function() {
        console.log("start :: ", exporter.name);
    }

    exporter.reset = function() {
        console.log("reset :: ", exporter.name);
        stop();
    }

    exporter.play = function () {
        play();
    };

    exporter.seek = function (seconds) {
        audio.currentTime = seconds;
        updateControl();
    };

    exporter.changeAudio = function(index) {
        if(index < 0 || index >= audioList.length) return;
        stop();
        setTimeout(function() {
            audio.src = audioList[index];
        }, 1);
    }

    return exporter;
};
