var singleChoice = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var quizBox;
    var buttons;

    var marks = [];

    var markGap = {
        x: -19,
        y: -11
    }

    var useDynamicMark = true;

    var useMark = 1;

    var answer;

    var enable = true;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        quizBox = spec.quizBox;
        // marks = amt.getAll(".mark", box);
        marks = _.toArray(amt.getAll(".mark", box));
        answer = parseInt(quizBox.dataset.answer);
        useMark = parseInt(quizBox.dataset.mark)

        if (marks.length > 0) {
            useDynamicMark = false;
        }

        // 마킹 디폴트 위치는 각 버튼들의 번호 불릿 위치임
        // 마킹 위치 조정
        var customGap = quizBox.dataset.markGap;
        if (customGap) {
            var arr = customGap.split(";");
            markGap.x = parseInt(arr[0]);
            markGap.y = parseInt(arr[1]);
        }

        var markPos = quizBox.dataset.markPos;

        buttons = amt.getAll(".button", quizBox);

        for (var i = 0; i < buttons.length; ++i) {
            for (var j = 0; j < buttons[i].children.length; ++j) {
                buttons[i].children[j].style.pointerEvents = "none";
            }
            var button = buttons[i];
            if (useDynamicMark) {
                var mark = document.createElement("div");
                mark.classList.add("mark");
                quizBox.appendChild(mark);
                if (markPos === "center") {
                    var btL = button.offsetLeft;
                    var btT = button.offsetTop;
                    var btW = button.offsetWidth;
                    var btH = button.offsetHeight;
                    var mkW = mark.offsetWidth;
                    var mkH = mark.offsetHeight;
                    mark.style.left = btL + (btW / 2 - (mkW / 2)) + "px";
                    mark.style.top = btT + (btH / 2 - (mkH / 2)) + "px";
                } else {
                    mark.style.left = button.offsetLeft + markGap.x + "px";
                    mark.style.top = button.offsetTop + markGap.y + "px";
                }
                marks[i] = mark;
                // 정오답 마킹 사용 안 함
                if (useMark === 0) {
                    mark.style.display = "none";
                }
            }
        }

        exporter.addOverEvent(buttons);
        quizBox.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
    }

    function hnClickButton(e) {
        if (!enable) return;
        var target = e.target;
        var index = _.indexOf(buttons, target);
        if (index > -1 && !target.classList.contains("correct")) {
            audioManager.play("click");
            checkAnswer(index);
        }
    }

    function checkAnswer(index) {
        if (index === answer) {
            audioManager.play("correct");
            correct(index);
            amt.sendMessage(document, "QUIZ_EVENT", {
                message: "CORRECT",
                quiz: exporter
            });
        } else {
            incorrect(index);
        }
    }

    function correct(index) {
        var button = buttons[index];
        button.classList.add("correct");
        var mark = marks[index];
        mark.classList.add("correct");
        mark.classList.remove("ani");
        void mark.offsetWidth; // trigger a DOM reflow
        mark.classList.add("ani");

        // 박스 보일 때 같이 보여야 할 node
        if (quizBox.dataset.visible) {
            var nodeNameList = quizBox.dataset.visible.split(";");
            for (var i = 0; i < nodeNameList.length; ++i) {
                var nodes = amt.getAll(nodeNameList[i], box);
                for (var j = 0; j < nodes.length; ++j) {
                    nodes[j].classList.remove("hide");
                }
            }
        }
        disableQuiz();
    }

    function incorrect(index) {
        audioManager.play("incorrect");
        var button = buttons[index];
        button.classList.add("incorrect");
        var mark = marks[index];
        mark.classList.add("incorrect");
        mark.classList.remove("ani");
        void mark.offsetWidth; // trigger a DOM reflow
        mark.classList.add("ani");
    }

    function enableQuiz() {
        enable = true;
        for (var i = 0; i < buttons.length; ++i) {
            var button = buttons[i];
            button.style.pointerEvents = "auto";
        }
    }

    function disableQuiz() {
        enable = false;
        for (var i = 0; i < buttons.length; ++i) {
            var button = buttons[i];
            button.style.pointerEvents = "none";
        }
    }

    exporter.showAnswer = function () {
        correct(answer);
    }

    exporter.hideAnswer = function () {
        exporter.reset();
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("correct");
            buttons[i].classList.remove("incorrect");
            buttons[i].classList.remove("over");
            marks[i].classList.remove("correct");
            marks[i].classList.remove("incorrect");
            marks[i].classList.remove("ani");
        }

        // 박스 보일 때 같이 보여야 할 node
        if (quizBox.dataset.visible) {
            var nodeNameList = quizBox.dataset.visible.split(";");
            for (var i = 0; i < nodeNameList.length; ++i) {
                var nodes = amt.getAll(nodeNameList[i], box);
                for (var j = 0; j < nodes.length; ++j) {
                    nodes[j].classList.add("hide");
                }
            }
        }
        enableQuiz();
    };

    return exporter;
}

var multipleChoice = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var quizBox;
    var buttons;

    var marks = [];

    var markGap = {
        x: -19,
        y: -11
    }

    var useDynamicMark = true;

    var useMark = 1

    var count = 0;

    var answer;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        quizBox = spec.quizBox;
        marks = _.toArray(amt.getAll(".mark", box));
        answer = quizBox.dataset.answer.split(";");
        useMark = parseInt(quizBox.dataset.mark)

        if (marks.length > 0) {
            useDynamicMark = false;
        }

        // 마킹 디폴트 위치는 각 버튼들의 번호 불릿 위치임
        // 마킹 위치 조정
        var customGap = quizBox.dataset.markGap;
        if (customGap) {
            var arr = customGap.split(";");
            markGap.x = parseInt(arr[0]);
            markGap.y = parseInt(arr[1]);
        }

        var markPos = quizBox.dataset.markPos;

        buttons = amt.getAll(".button", quizBox);

        for (var i = 0; i < buttons.length; ++i) {
            for (var j = 0; j < buttons[i].children.length; ++j) {
                buttons[i].children[j].style.pointerEvents = "none";
            }
            var button = buttons[i];
            if (useDynamicMark) {
                var mark = document.createElement("div");
                mark.classList.add("mark");
                quizBox.appendChild(mark);
                if (markPos === "center") {
                    var btL = button.offsetLeft;
                    var btT = button.offsetTop;
                    var btW = button.offsetWidth;
                    var btH = button.offsetHeight;
                    var mkW = mark.offsetWidth;
                    var mkH = mark.offsetHeight;
                    mark.style.left = btL + (btW / 2 - (mkW / 2)) + "px";
                    mark.style.top = btT + (btH / 2 - (mkH / 2)) + "px";
                } else {
                    mark.style.left = button.offsetLeft + markGap.x + "px";
                    mark.style.top = button.offsetTop + markGap.y + "px";
                }
                marks[i] = mark;
                // 정오답 마킹 사용 안 함
                if (useMark === 0) {
                    mark.style.display = "none";
                }
            }
        }

        exporter.addOverEvent(buttons);
        quizBox.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
    }

    function hnClickButton(e) {
        var target = e.target;
        var index = _.indexOf(buttons, target);
        if (index > -1 && !target.classList.contains("correct")) {
            audioManager.play("click");
            checkAnswer(index);
        }
    }

    function checkAnswer(index) {
        var bool = false;
        for (var i = 0; i < answer.length; ++i) {
            if (index === parseInt(answer[i])) {
                bool = true;
                break;
            }
        }
        if (bool) {
            audioManager.play("correct");
            correct(index);
            ++count;
            if (count === answer.length) {
                amt.sendMessage(document, "QUIZ_EVENT", {
                    message: "CORRECT",
                    quiz: exporter
                });
                disableQuiz();
            }
        } else {
            audioManager.play("incorrect");
            incorrect(index);
        }
    }

    function correct(index) {
        var button = buttons[index];
        button.classList.add("correct");
        var mark = marks[index];
        mark.classList.add("correct");
        mark.classList.remove("ani");
        void mark.offsetWidth; // trigger a DOM reflow
        mark.classList.add("ani");

        // 박스 보일 때 같이 보여야 할 node
        if (quizBox.dataset.visible) {
            var nodeNameList = quizBox.dataset.visible.split(";");
            for (var i = 0; i < nodeNameList.length; ++i) {
                var nodes = amt.getAll(nodeNameList[i], box);
                for (var j = 0; j < nodes.length; ++j) {
                    nodes[j].classList.remove("hide");
                }
            }
        }
    }

    function incorrect(index) {
        audioManager.play("incorrect");
        var button = buttons[index];
        button.classList.add("incorrect");
        var mark = marks[index];
        mark.classList.add("incorrect");
        mark.classList.remove("ani");
        void mark.offsetWidth; // trigger a DOM reflow
        mark.classList.add("ani");
    }

    function enableQuiz() {
        for (var i = 0; i < buttons.length; ++i) {
            var button = buttons[i];
            button.style.pointerEvents = "auto";
        }
    }

    function disableQuiz() {
        for (var i = 0; i < buttons.length; ++i) {
            var button = buttons[i];
            button.style.pointerEvents = "none";
        }
    }

    exporter.showAnswer = function () {
        for (var i = 0; i < answer.length; ++i) {
            correct(answer[i]);
        }
        disableQuiz();
    }

    exporter.hideAnswer = function () {
        exporter.reset();
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("correct");
            buttons[i].classList.remove("incorrect");
            buttons[i].classList.remove("over");
            marks[i].classList.remove("correct");
            marks[i].classList.remove("incorrect");
            marks[i].classList.remove("ani");
        }

        // 박스 보일 때 같이 보여야 할 node
        if (quizBox.dataset.visible) {
            var nodeNameList = quizBox.dataset.visible.split(";");
            for (var i = 0; i < nodeNameList.length; ++i) {
                var nodes = amt.getAll(nodeNameList[i], box);
                for (var j = 0; j < nodes.length; ++j) {
                    nodes[j].classList.add("hide");
                }
            }
        }
        count = 0;
        enableQuiz();
    };

    return exporter;
}

var lineDrawing = function (spec) {
    var exporter = _.extend(baseModule());
    var doc = document;
    var box;
    var svg;
    var quizBox;
    var svgBox;
    var downPoint;

    var sPoints;
    var ePoints;

    var line;

    var svgBoxPosition = {};
    var sPosition = {};

    // start point(point가 많은 쪽) index에 저장
    var lines = [];

    var scale = 1;

    var answers;

    var enable = true;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        quizBox = spec.quizBox;
        answers = quizBox.dataset.answer.split(";");

        scale = globalScale;

        svgBox = doc.createElement('div');
        svgBox.style.position = "absolute";
        svgBox.style.left = "0px";
        svgBox.style.top = "0px";
        svgBox.style.width = "100%";
        svgBox.style.height = "100%";
        // svgBox.style.pointerEvents = "none";
        // svgBox.style.border = '1px solid red';
        quizBox.insertBefore(svgBox, quizBox.childNodes[0]);

        svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.style.position = "absolute";
        svg.style.left = '0px';
        svg.style.top = '0px';
        // svg.id             = "drawingSvg";
        // svg.style.pointerEvents = "none";
        // svg.style.border = "1px solid blue";
        svgBox.appendChild(svg);

        sPoints = amt.getAll(".start-point", quizBox);
        ePoints = amt.getAll(".end-point", quizBox);

        var rect = svgBox.getBoundingClientRect();
        svgBoxPosition.x = rect.left;
        svgBoxPosition.y = rect.top;

        quizBox.addEventListener(amt.mouseTouchEvent.down, hnDown);
    }

    function hnDown(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!enable) return;
        var target = e.target;
        var sIndex = _.indexOf(sPoints, target);
        var eIndex = _.indexOf(ePoints, target);
        if (sIndex > -1) {
            if (lines[sIndex]) {
                line = lines[sIndex];
            } else {
                line = createLine(sIndex);
            }
            sPosition = amt.getOffsetInContainer(target, quizBox, true);
            downPoint = target;
            doc.body.addEventListener(amt.mouseTouchEvent.move, hnMove);
            doc.body.addEventListener(amt.mouseTouchEvent.up, hnUp);
        } else if (eIndex > -1) {
            line = createLine(eIndex);
            sPosition = amt.getOffsetInContainer(target, quizBox, true);
            downPoint = target;
            doc.body.addEventListener(amt.mouseTouchEvent.move, hnMove);
            doc.body.addEventListener(amt.mouseTouchEvent.up, hnUp);
        }
    }

    function hnMove(e) {
        e.stopPropagation();
        var pos = {};
        pos.x = getCoordinate(e, svgBox).x / scale;
        pos.y = getCoordinate(e, svgBox).y / scale;
        drawLine(sPosition.x, sPosition.y, pos.x, pos.y);
    }

    function hnUp(e) {
        e.stopPropagation();
        e.preventDefault();
        var target = e.target;
        var index;

        var sIndex = _.indexOf(sPoints, downPoint);
        var eIndex = _.indexOf(ePoints, downPoint);

        // 시작이 sPoint
        if (sIndex > -1) {
            index = _.indexOf(ePoints, target);

            if (index > -1) {
                // lines[sIndex] = line;
                // connect(target);
                checkAnswer(target, sIndex, index);
                // if(checkAnswer(sIndex, index)) {
                //     console.log("정답");
                //     audioManager.play("correct");
                //     lines[sIndex] = line;
                //     connect(target);
                // } else {
                //     console.log("오답");
                //     cancelDraw();
                // }
            } else {
                cancelDraw();
            }

            // 시작이 ePoint
        } else if (eIndex > -1) {
            index = _.indexOf(sPoints, target);

            if (index > -1) {
                // 이미 연결된 선이 있으면 선긋기 취소
                if (lines[index]) {
                    cancelDraw();
                } else {
                    // lines[index] = line;
                    // connect(target);
                    checkAnswer(target, index, eIndex);
                    // if(checkAnswer(index, eIndex)) {
                    //     console.log("정답");
                    //     lines[index] = line;
                    //     connect(target);
                    // } else {
                    //     console.log("오답");
                    //     cancelDraw();
                    // }
                }
            } else {
                cancelDraw();
            }

        }

        doc.body.removeEventListener(amt.mouseTouchEvent.move, hnMove);
        doc.body.removeEventListener(amt.mouseTouchEvent.up, hnUp);
    }

    function checkAnswer(target, sIndex, eIndex) {
        var bool = false;
        console.log(sIndex, eIndex);
        var answer = parseInt(answers[sIndex]);
        var select = eIndex;
        if (answer === select) {
            bool = true;
        }
        if (bool) {
            correct(target, sIndex);
        } else {
            incorrect();
        }
        // return bool;
    }

    function correct(target, sIndex) {
        console.log("정답");
        audioManager.play("correct");
        connect(target, sIndex);

        // 정답 다 연결 했는지 체크
        var count = 0;
        for (var i = 0; i < lines.length; ++i) {
            if (lines[i] !== undefined) {
                ++count;
            }
        }
        if (count === answers.length) {
            amt.sendMessage(document, "QUIZ_EVENT", {
                message: "CORRECT",
                quiz: exporter
            });
            enable = false;
        }
    }

    function incorrect() {
        console.log("오답");
        audioManager.play("incorrect");
        cancelDraw();
    }

    function createLine(index) {
        var line = doc.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("id", "line-" + index);
        line.style.stroke = "#00B7FF";
        line.style.strokeWidth = "5";
        line.style.strokeLinecap = "round";
        line.style.visibility = "hidden";
        svg.appendChild(line);
        return line;
    }

    function connect(point, sIndex) {
        var ePosition = amt.getOffsetInContainer(point, quizBox, true);
        drawLine(sPosition.x, sPosition.y, ePosition.x, ePosition.y);
        lines[sIndex] = line;
        console.log(lines);
    }

    function drawLine(sx, sy, ex, ey) {
        if (line) {
            line.style.visibility = 'visible';
            line.setAttribute('x1', sx.toString());
            line.setAttribute('y1', sy.toString());
            line.setAttribute('x2', ex.toString());
            line.setAttribute('y2', ey.toString());
        }
    }

    function cancelDraw() {
        if (line) {
            svg.removeChild(line);
            for (var i = 0; i < lines.length; ++i) {
                if (lines[i] === line) {
                    lines[i] = undefined;
                    break;
                }
            }
            line = undefined;
        }
    }

    function getCoordinate(e, base) {
        var clientX = typeof e.clientX === 'number' ? e.clientX : e.changedTouches[0].clientX;
        var clientY = typeof e.clientY === 'number' ? e.clientY : e.changedTouches[0].clientY;

        var box = base.getBoundingClientRect();

        var offsetX = clientX - box.left;
        var offsetY = clientY - box.top;

        return {
            x: offsetX,
            y: offsetY
        };
    }

    function reset() {
        enable = true;
        for (var i = 0; i < lines.length; ++i) {
            if (lines[i] !== undefined) {
                var line = lines[i];
                svg.removeChild(line);
                lines[i] = undefined;
            }
        }
    }

    broadcaster.on("RESIZE_WINDOW", function (e) {
        scale = e.windowRatio;
    });

    exporter.showAnswer = function () {
        console.log("show answer");
        reset();
        for (var i = 0; i < answers.length; ++i) {
            var answer = parseInt(answers[i]);
            var sPoint = sPoints[i];
            var ePoint = ePoints[answer];
            sPosition = amt.getOffsetInContainer(sPoint, quizBox, true);
            line = createLine(i);
            connect(ePoint, i);
        }
        enable = false;
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        reset();
    };

    return exporter;
}

var toggleChat = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var quizBox;
    var buttons;

    var answer;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        quizBox = spec.quizBox;
        answer = quizBox.dataset.answer.split(";");

        buttons = amt.getAll(".chat", quizBox);

        for (var i = 0; i < buttons.length; ++i) {
            for (var j = 0; j < buttons[i].children.length; ++j) {
                buttons[i].children[j].style.pointerEvents = "none";
            }
        }

        exporter.addOverEvent(buttons);
        quizBox.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
    }

    function hnClickButton(e) {
        var target = e.target;
        var index = _.indexOf(buttons, target);
        if (index > -1) {
            audioManager.play("click");
            // target.classList.toggle("on");
            checkAnswer(index);
        }
    }

    function checkAnswer(index) {
        var bool = false;
        for (var i = 0; i < answer.length; ++i) {
            if (index === parseInt(answer[i])) {
                bool = true;
                break;
            }
        }
        if (bool) {
            correct(index);
            // ++count;
            // if (count === answer.length) {
            //     amt.sendMessage(document, "QUIZ_EVENT", {
            //         message: "CORRECT",
            //         quiz: exporter
            //     });
            //     disableQuiz();
            // }
        } else {
            incorrect(index);
        }
    }

    function correct(index) {
        var button = buttons[index];
        button.classList.toggle("correct");
        if (button.classList.contains("correct")) {
            audioManager.play("correct");
        }
    }

    function incorrect(index) {
        audioManager.play("incorrect");
        var button = buttons[index];
        button.classList.add("incorrect");
    }

    function enableQuiz() {
        for (var i = 0; i < buttons.length; ++i) {
            var button = buttons[i];
            button.style.pointerEvents = "auto";
        }
    }

    function disableQuiz() {
        for (var i = 0; i < buttons.length; ++i) {
            var button = buttons[i];
            button.style.pointerEvents = "none";
        }
    }

    exporter.showAnswer = function () {
        for (var i = 0; i < answer.length; ++i) {
            correct(answer[i]);
        }
        disableQuiz();
    }

    exporter.hideAnswer = function () {
        exporter.reset();
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("correct");
            buttons[i].classList.remove("incorrect");
            buttons[i].classList.remove("over");
        }
        enableQuiz();
    };

    return exporter;
}