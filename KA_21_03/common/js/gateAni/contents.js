var CONTENTS = CONTENTS || {};
CONTENTS = (function () {
  var contents = {
    start: function () {
      setTimeout(function(){
        if($ts.getEl('[data-open-gate]')) {
          $ts.loadScriptFile('js/cmn_openGate.js', function(){
            openGateInit();
          });
        }
        if($ts.getEl('[data-addLine-container]')) {
          $ts.loadScriptFile('js/quiz_addLine.js', function(){
            addLineInit();
          });
        }
        if($ts.getEl('[data-puzzle-container]')) {
          $ts.loadScriptFile('js/quiz_math_word.js', function(){
            puzzleQuizInit();
          });
        }
        if($ts.getEl('[data-calc-container]')) {
          $ts.loadScriptFile('js/quiz_math_calc.js', function(){
            mathCalculationInit();
          });
        }
        if($ts.getEl('[data-video-link]')) {
          $ts.loadScriptFile('http://e.tsherpa.co.kr/include/js/tsherpa.js', function(){
            tSherpaVideoInit();
          });
        }
        if(window.location.href.indexOf('http')  > -1){
          $ts.loadScriptFile('common/libs/js/fetch.umd.js', function(){
            $ts.loadScriptFile('common/libs/js/promise.polyfill.js', function(){
              initiatePageInfo('pageInfo');
            });
          });
        }
        if($ts.getEl('.wordQuizContent').length) {
          $ts.loadScriptFile('js/quiz_life_wordQuiz.js', function(){
            wordQuizHint();
          });
        }
        if($ts.getEl('.fishing').length) {
          $ts.loadScriptFile('js/quiz_life_fishingGame.js', function(){
            fishingGame();
          });
        }
      }, 50);

    },
    reset: function () {
      if($ts.getEl('[data-addLine-container]')) {
        $ts.loadScriptFile('js/quiz_addLine.js', function(){
          resetAddLine();
        });
      }
      if($ts.getEl('.charSpriteAni').length > 0) $prite.allresetSprite();
    }
  };
  return contents;
})();

// 티셀파 비디오 링크
function tSherpaVideoInit() {
  var tVideo = $ts.getEl('[data-video-link]');
  tVideo.forEach(function (video) {
    video.addEventListener('click', tSherpaGoLink);
    video.addEventListener('click', $efSound.click);
  });
  function tSherpaGoLink() {
    viewChunjaeMedia(this.getAttribute('data-video-link'));
  }
}


// 자음모음 퀴즈_힌트 보기
function wordQuizHint() {
  var hintBtn =document.querySelector('.wordQuizContent [data-hint]');

  window.$callBack.viewAnswer = function(obj) {
    hintBtn.classList.add('off');
  }
  window.$callBack.hideAnswer = function(obj) {
    hintBtn.classList.remove('off');
  }
  hintBtn.addEventListener('click', function() {
    var hintDrag = document.querySelectorAll('[data-hint-obj]');
    var hintDrop = document.querySelectorAll('[data-hint-area]');

    hintDrag.forEach(function(dragObj) {
      hintDrop.forEach(function(dropArea) {
        var dragIdx = dragObj.getAttribute('data-hint-obj');
        var dropIdx = dropArea.getAttribute('data-hint-area');

        var copiedElement = dragObj.cloneNode(true);
        copiedElement.classList.add('dragObjComplete');
        dropArea.appendChild(copiedElement);
      });
      dragObj.classList.add('dragObjComplete')
    });
    hintBtn.classList.add('off')
  });
  
}

function initiatePageInfo(varName) {
  console.log('window.initiatePageInfo()');

  var fetch = window.WHATWGFetch.fetch;

  return fetch('./js/pageInfo.json', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).catch(function(error) {
    console.error(error);
  }).then(toJson)
  .then(filterPageInfo)
  .then(render)
  .then(function(obj) {
    window[varName] = obj;
    console.log('window.pageInfo:', window.pageInfo);
  })

  function toJson(response) {
    return response.json();
  }

  function filterPageInfo(pageInfo) {
    console.log('window.initiatePageInfo > filterPageInfo()');

    var page = getHtmlFileName();

    function getHtmlFileName() {
      var spliitedArray = window.location.pathname.split('/'),
        targetArray = spliitedArray.filter(function(item) { return /.html/g.test(item); });
        console.log(spliitedArray)
      return targetArray[0];
    }

    function getTargetPageInfo(page, pageInfo) {
      var targetArray = pageInfo.filter(function(item) { return item.page === page; });
  
      return targetArray[0];
    }

    return getTargetPageInfo(page, pageInfo);
  }

  function render(pageInfo) {
    console.groupCollapsed('window.initiatePageInfo > render()');

    if (!pageInfo) {
      console.error('window.initiatePageInfo ~> pageInfo에 일치하는 html명이 없음.');
    }

    var wrap,
      fakeUiHeader,
      container,
      icon,
      title,
      type,
      number;

    wrap = $ts.getEl('#wrap');
    fakeUiHeader = window.$ts.ce({
      tag: 'div',
      class: 'fake-ui-header',
      parent: wrap,
      insertBeforeRefEl: wrap.children[0]
    });
    container = curriedCE(fakeUiHeader)('page-info');
    icon = curriedCE(container)('page-info__icon');
    title = curriedCE(container)('page-info__title');

    if(pageInfo.type) type = curriedCE(container)('page-info__type');
    if(pageInfo.number) number = curriedCE(container)('page-info__number');
    icon = initiateLoadingIcon({
      element: icon,
      length: 8,
      onLength: 4,
      width: 40,
      interval: 80,
      bgColor: 'ff6600' // hex
    });

    // icon.hide(); // loading icon 숨김
    icon.pause();

    title.innerHTML = pageInfo.title;
    if(pageInfo.type) type.innerHTML = pageInfo.type;
    if(pageInfo.number) number.innerHTML = pageInfo.number;


    console.groupEnd();

    return {
      data: pageInfo,
      icon: icon,
    }
  }
}

function initiateLoadingIcon(opts) {
  console.log('window.initiateLoadingIcon()');

  var element = opts.element || document.body,
    LENGTH = opts.length || 8,
    ON_LENGTH = opts.onLength || 4,
    bgColor = opts.bgColor,
    rgbColorArray = convertHexToRgb(bgColor),
    size,
    bars = [],
    intervalId = 0,
    intervalCnt = 0;

  size = {
    width: opts.width || 40,
    height: opts.width,
    get barWidth() { return this.width / LENGTH; },
    get barHeight() { return this.height * 2 / 7; },
    get barBorder() { return this.barWidth / 2; },
    get barTop() { return 0; },
    get barLeft() { return (this.width - this.barWidth) / 2; },
    get barTransformOrigin() { return this.barBorder + 'px ' + (this.height - this.barTop) / 2 + 'px'; },
  };

  element.style.width = size.width + 'px';
  element.style.height = size.height + 'px';
  
  for (var i = 0, bar; i < LENGTH; i++) {
    bar = document.createElement('div');
    bar.classList.add('page-info__icon__bar');
    bar.style.position = 'absolute';
    bar.style.width = size.barWidth + 'px';
    bar.style.height = size.barHeight + 'px';
    bar.style.borderRadius = size.barBorder + 'px';
    bar.style.top = size.barTop + 'px';
    bar.style.left = size.barLeft + 'px';
    bar.style.transformOrigin = size.barTransformOrigin;
    bar.style.transform = 'rotate(' + (360 / LENGTH * i) + 'deg)';
    bar.appendChild(document.createElement('div'));
    element.appendChild(bar);
    bars.push(bar);
  }

  play();

  function show() {
    element.classList.remove('page-info__icon--hide');
    element.classList.add('page-info__icon--show');
  }

  function hide() {
    element.classList.remove('page-info__icon--show');
    element.classList.add('page-info__icon--hide');
  }

  function play() {
    pause();
    intervalId = setInterval(intervalFnc, opts.interval || 80);
    updateBar(intervalCnt);
  }

  function pause() {
    clearInterval(intervalId);
  }

  function intervalFnc() {
    intervalCnt++;
    if (intervalCnt >= LENGTH) {
      intervalCnt = 0;
    }

    updateBar(intervalCnt);
  }

  function confirmBarToOn(intervalCnt, index) {
    var modifiedIndex = intervalCnt >= index ?  index + LENGTH : index;
    modifiedIndex = LENGTH - modifiedIndex + intervalCnt;
    return modifiedIndex < ON_LENGTH;
  }

  function calcOpacity(intervalCnt, index) {
    var modifiedIndex, opacity;
    modifiedIndex = intervalCnt >= index ?  index + LENGTH : index;
    modifiedIndex = LENGTH - modifiedIndex + intervalCnt;
    if (modifiedIndex === 0) {
      opacity = 1;
    } else {
      if (modifiedIndex > 0 && modifiedIndex < ON_LENGTH) {
        opacity = 1;
        // opacity = 1 - modifiedIndex / ON_LENGTH;
      } else {
        opacity = 0;
      }
    }

    return opacity;
  }

  function updateBar(intervalCnt) {
    for (var i = 0, bar; i < LENGTH; i++) {
      bar = bars[i];

      onBar(bar, confirmBarToOn(intervalCnt, i));
      setOpacity(bar, calcOpacity(intervalCnt, i));
    }
  }

  function onBar(bar, bool) {
    bar.classList[bool ? 'add' : 'remove']('page-info__icon__bar--on');
  }

  function setOpacity(bar, value) {
    curryingSetRGBaColor(bar.children[0], rgbColorArray)(value);
  }

  function convertHexToRgb(hex) {
    var rgbArray = [];
  
    for (var i = 0; i < 3; i++) {
      rgbArray.push(hex.slice(i * 2, (i + 1) * 2))
    }
  
    return rgbArray.map(function(item) {
      return parseInt(item, 16);
    });
  }

  function setRGBaColor(rgbArray, opacity, element) {
    var code = 'rgba(';
    rgbArray.forEach(function(eachCode, idx) {
      if (idx !== 0) {
        code += ', ';
      }
      code += eachCode;
    });
    code += ', ';
    code += opacity;
    code += ')';
    element.style.backgroundColor = code;
  }
  
  function curryingSetRGBaColor(element, rgbArray) {
    return function(opacity) {
      setRGBaColor(rgbArray, opacity, element);
    }
  }

  return {
    element: element,
    show: show,
    hide: hide,
    play: play,
    pause: pause,
  }
}

function curriedCE(_parent) {
  return function(_class) {
    return window.$ts.ce({
      tag: 'div',
      class: _class,
      parent: _parent
    });
  }
}