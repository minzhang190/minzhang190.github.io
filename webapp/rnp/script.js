var preload = new createjs.LoadQueue();

document.title = title;

var style = document.getElementById('style');
style.innerHTML = importFonts;

var canvas = document.getElementById('canvas');
var stage = new createjs.Stage(canvas);
createjs.Ticker.framerate = 60;
createjs.Ticker.addEventListener('tick', stage);

var current = 0;
var previousContainer = null;

function cursor(style) {
    canvas.style.cursor = style;
}

function welldone() {
    var image = preload.getResult('welldone');
    var bitmap = new createjs.Bitmap(image);
    if (previousContainer) {
        stage.removeChild(previousContainer);
    }
    stage.addChild(bitmap);
}

function hitArea(text) {
    var hit = new createjs.Shape();
    hit.graphics.beginFill("#000").drawRect(-text.getMeasuredWidth() / 2, -text.getMeasuredHeight() / 2, text.getMeasuredWidth(), text.getMeasuredHeight());
    text.hitArea = hit;
}

function question(e) {
    if (e && e.stageX > 650 && e.stageY > 190 && e.stageX < 1120 && e.stageY < 760) {
        return;
    }

    if (current == data.length) {
        stage.removeEventListener('click', question);
        welldone();
        return;
    }

    var container = new createjs.Container();

    var questionImage = preload.getResult('question');
    var questionBitmap = new createjs.Bitmap(questionImage);
    container.addChild(questionBitmap);

    var questionText = new createjs.Text(questionLine, questionFont, questionColor);
    questionText.scale = Math.min(1000 / questionText.getMeasuredWidth(), 100 / questionText.getMeasuredHeight());
    questionText.textAlign = 'center';
    questionText.textBaseline = 'middle';
    questionText.x = 600;
    questionText.y = 125;
    questionText.shadow = new createjs.Shadow('#808080', 10, 10, 20);
    container.addChild(questionText);

    var image = preload.getResult('image-' + current);
    var bitmap = new createjs.Bitmap(image);
    var bitmapScale = Math.min(400 / image.width, 400 / image.height);
    bitmap.scale = bitmapScale;
    bitmap.x = 310 - image.width * bitmapScale / 2;
    bitmap.y = 450 - image.height * bitmapScale / 2;
    bitmap.shadow = new createjs.Shadow('#a0a0a0', 0, 0, 50);
    container.addChild(bitmap);

    var answerNr = Math.floor(Math.random() * 3);
    var answerIdx = current;
    var wrong1Nr = (answerNr + 1) % 3;
    var wrong2Nr = 3 - answerNr - wrong1Nr;
    var wrong1Idx = current, wrong2Idx = current;
    while (wrong1Idx == current) {
        wrong1Idx = Math.floor(Math.random() * data.length);
    }
    while (wrong2Idx == current || wrong2Idx == wrong1Idx) {
        wrong2Idx = Math.floor(Math.random() * data.length);
    }

    var buttonInfo = [null, null, null];
    buttonInfo[answerNr] = {
        index: answerIdx,
        correct: true,
    };
    buttonInfo[wrong1Nr] = {
        index: wrong1Idx,
        correct: false,
    };
    buttonInfo[wrong2Nr] = {
        index: wrong2Idx,
        correct: false,
    };

    buttonInfo.forEach(function(info, nr) {
        var answerText = new createjs.Text(data[info.index].pinyin, answerFont, answerColors[nr]);
        answerText.scale = Math.min(350 / answerText.getMeasuredWidth(), 100 / answerText.getMeasuredHeight());
        answerText.textAlign = 'center';
        answerText.textBaseline = 'middle';
        answerText.x = 890;
        answerText.y = 295 + nr * 185;
        answerText.shadow = new createjs.Shadow('#808080', 5, 5, 10);
        hitArea(answerText);

        answerText.addEventListener('click', function(e) {
            if (!info.correct) {
                createjs.Sound.play('sound1-' + info.index);
                var image = preload.getResult('image-' + info.index);
                var bitmap = new createjs.Bitmap(image);
                var bitmapScale = Math.min(100 / image.width, 100 / image.height);
                bitmap.scale = bitmapScale;
                bitmap.x = 590 - image.width * bitmapScale / 2;
                bitmap.y = 295 + nr * 185 - image.height * bitmapScale / 2;
                container.addChild(bitmap);
                return;
            }

            createjs.Sound.play('correct').on('complete', function() {
                var image = preload.getResult('mark');
                var bitmap = new createjs.Bitmap(image);
                var bitmapScale = Math.min(300 / image.width, 300 / image.height);
                bitmap.scale = bitmapScale;
                bitmap.x = 210 - image.width * bitmapScale / 2;
                bitmap.y = 650 - image.height * bitmapScale / 2;
                container.addChild(bitmap);
                createjs.Sound.play('good').on('complete');
            });
        });

        container.addChild(answerText);
    });

    if (previousContainer) {
        stage.removeChild(previousContainer);
    }
    stage.addChild(container);
    previousContainer = container;
    var previous = current++;
}

function card() {
    if (current == data.length) {
        stage.removeEventListener('click', card);
        current = 0;
        question();
        stage.addEventListener('click', question);
        return;
    }

    var container = new createjs.Container();

    var backgroundImage = preload.getResult('background');
    var backgroundBitmap = new createjs.Bitmap(backgroundImage);
    container.addChild(backgroundBitmap);

    var pinyin = data[current].pinyin;
    var english = data[current].english;

    var pinyinText = new createjs.Text(pinyin, pinyinFont, pinyinColor);
    pinyinText.scale = Math.min(1000 / pinyinText.getMeasuredWidth(), 150 / pinyinText.getMeasuredHeight());
    pinyinText.textAlign = 'center';
    pinyinText.textBaseline = 'middle';
    pinyinText.x = 600;
    pinyinText.y = 160;
    pinyinText.shadow = new createjs.Shadow('#808080', 10, 10, 20);
    container.addChild(pinyinText);

    var image = preload.getResult('image-' + current);
    var bitmap = new createjs.Bitmap(image);
    var bitmapScale = Math.min(400 / image.width, 400 / image.height);
    bitmap.scale = bitmapScale;
    bitmap.x = 600 - image.width * bitmapScale / 2;
    bitmap.y = 480 - image.height * bitmapScale / 2;
    bitmap.shadow = new createjs.Shadow('#a0a0a0', 0, 0, 50);
    container.addChild(bitmap);

    var englishText = new createjs.Text(english, englishFont, englishColor);
    englishText.scale = Math.min(1000 / pinyinText.getMeasuredWidth(), 100 / pinyinText.getMeasuredHeight());
    englishText.textAlign = 'center';
    englishText.textBaseline = 'middle';
    englishText.x = 600;
    englishText.y = 760;
    englishText.shadow = new createjs.Shadow('#808080', 10, 10, 20);
    container.addChild(englishText);

    if (previousContainer) {
        stage.removeChild(previousContainer);
    }
    stage.addChild(container);
    previousContainer = container;
    var previous = current++;

    createjs.Sound.play('sound1-' + previous).on('complete', function() {
        setTimeout(function() {
            createjs.Sound.play('sound2-' + previous).on('complete', function() {
                setTimeout(function() {
                    createjs.Sound.play('sound3-' + previous);
                }, 800);
            });
        }, 800);
    });
}

function play() {
    cursor('auto');

    stage.removeChild(previousContainer);
    previousContainer = null;

    card();
    stage.addEventListener('click', card);
}

function start() {
    stage.removeEventListener('click', start);

    cursor('wait');

    preload.installPlugin(createjs.Sound);
    preload.on('complete', function(e) {
        document.fonts.ready.then(play);
    });
    preload.loadManifest([
        {id: 'background', src: 'resources/background.png', type: createjs.Types.IMAGE},
        {id: 'correct', src: 'resources/correct.wav', type: createjs.Types.SOUND},
        {id: 'good', src: 'resources/good.wav', type: createjs.Types.SOUND},
        {id: 'mark', src: 'resources/mark.png', type: createjs.Types.IMAGE},
        {id: 'next', src: 'resources/next.png', type: createjs.Types.IMAGE},
        {id: 'question', src: 'resources/question.png', type: createjs.Types.IMAGE},
        {id: 'welldone', src: 'resources/welldone.png', type: createjs.Types.IMAGE},
    ], false);

    data.forEach(function(card, idx) {
        preload.loadManifest([
            {id: 'image-' + idx, src: prefix + card.image, type: createjs.Types.IMAGE},
            {id: 'sound1-' + idx, src: prefix + card.sound1, type: createjs.Types.SOUND},
            {id: 'sound2-' + idx, src: prefix + card.sound2, type: createjs.Types.SOUND},
            {id: 'sound3-' + idx, src: prefix + card.sound3, type: createjs.Types.SOUND},
        ], false);
    });

    preload.load();
}

var cover = previousContainer = new createjs.Container();

var coverBitmap = new createjs.Bitmap(prefix + 'cover.png');
cover.addChild(coverBitmap);

var coverText = new createjs.Text(title, titleFont, titleColor);
coverText.scale = Math.min(1000 / coverText.getMeasuredWidth(), 150 / coverText.getMeasuredHeight());
coverText.textAlign = 'center';
coverText.textBaseline = 'middle';
coverText.x = 600;
coverText.y = 150;
coverText.shadow = new createjs.Shadow('#808080', 10, 10, 20);
cover.addChild(coverText);
stage.addChild(previousContainer);

cursor('pointer');
stage.addEventListener('click', start);
