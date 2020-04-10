document.title = title;

$('#h1').text(title);

var $container = $('#container')
var $row = $('<div/>').addClass('row').appendTo($container);

var running = false;
var $runningText = null;
var runningIndex = -1;
var answer = null;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var words = [];

var recognition = new SpeechRecognition();

recognition.onstart = function(event) {
    if (!running) {
        return;
    }
    $runningText.text('Recording');
};

recognition.onend = function(event) {
    if (!running) {
        return;
    }
    running = false;
    runningIndex = -1;
    $runningText.text('Nothing detected');
};

recognition.onresult = function(event) {
    console.log(event);
    if (!running) {
        return;
    }
    var result = event.results[0][0].transcript;
    var confidence = event.results[0][0].confidence;
    running = false;
    runningIndex = -1;
    if (answer == result) {
        $runningText.text('Correct!').parents('.card-body').addClass('bg-success');
    } else {
        $runningText.text('Try again');
    }
};

recognition.onnomatch = function(event) {
    if (!running) {
        return;
    }
    running = false;
    runningIndex = -1;
    $runningText.text('No match');
};

recognition.onerror = function(event) {
    if (!running) {
        return;
    }
    running = false;
    runningIndex = -1;
    $runningText.text('Error: ' + event.error);
};

recognition.onspeechend = function(event) {
    if (!running) {
        return;
    }
    $runningText.text('Recognizing');
    recognition.stop();
};

data.forEach(function(word, index) {
    var $col = $('<div/>').addClass('col-md-4');
    var $img = $('<img/>').addClass('card-img-top').attr('src', prefix + word.image).css('background', '#55595c').appendTo($col);
    var $card = $('<div/>').addClass('card mb-4 shadow-sm').appendTo($col);
    var $body = $('<div/>').addClass('card-body').appendTo($card);
    var $text = $('<p/>').addClass('card-text text-center').text('To-do').appendTo($body);
    var $flex = $('<div/>').addClass('d-flex justify-content-between align-items-center').appendTo($body);
    var $small = $('<span/>').addClass('text-dark').text(word.pinyin).appendTo($flex);
    var $group = $('<div/>').addClass('btn-group').appendTo($flex);
    var $go = $('<button/>').addClass('btn btn-sm btn-outline-primary').attr('type', 'button').text('Go').appendTo($group);

    createjs.Sound.registerSound(prefix + word.sound, 'word-' + index);

    words.push(word.text);

    $go.click(function() {
        if (running) {
            return;
        }

        running = true;
        $text.text('Listen now');

        createjs.Sound.play('word-' + index).on('complete', function() {
            $text.text('Your turn');

            $runningText = $text;
            runningIndex = index;
            answer = word.text;
            running = true;
            recognition.start();
        });
    });

    $col.appendTo($row);
});

var grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ';';
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'cmn-Hans-CN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
