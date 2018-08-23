(function($) {
    window.showGame = function() {
        var $root = $('#root').empty();
        var $game = window.$game.clone().appendTo($root);
        $('html').addClass('game-in-progress');
    };

    var countdown = 0;
    var countdownInterval = null;
    window.gameCountdown = function(seconds, callback) {
        countdown = seconds;
        $('#game-timer').text(countdown);

        if (countdownInterval != null) {
            // Have to clear this or the callback function would be incorrect.
            window.clearInterval(countdownInterval);
        }

        countdownInterval = window.setInterval(function() {
            if (countdown == 0) {
                window.clearInterval(countdownInterval);
                countdownInterval = null;
                callback();
                return;
            }

            $('#game-timer').text(--countdown);
        }, 1000);
    };
    window.gameCancelCountdown = function() {
        window.clearInterval(countdownInterval);
        countdownInterval = null;
    };

    var score = 0;
    var scoreDisplay = 0;
    var scoreInterval = null;
    window.gameClearScoreInterval = function() {
        if (scoreInterval != null) {
            window.clearInterval(scoreInterval);
            scoreInterval = null;
        }
    };
    window.gameSetScore = function(newScore) {
        score = newScore;

        if (scoreInterval != null) {
            return;
        }

        scoreInterval = window.setInterval(function() {
            if (score == scoreDisplay) {
                window.gameClearScoreInterval();
                return;
            }

            var diff = Math.abs(score - scoreDisplay);
            diff = Math.max(Math.floor(diff / 50), 1);

            if (score > scoreDisplay) {
                $('#game-score').text(scoreDisplay += diff);
            } else if (score < scoreDisplay) {
                $('#game-score').text(scoreDisplay -= diff);
            }
        }, 10);
    };
    window.gameInitScore = function(newScore) {
        score = scoreDisplay = newScore;
        $('#game-score').text(scoreDisplay);
        window.gameClearScoreInterval();
    };
    window.gameAddScore = function(increment) {
        window.gameSetScore(score + increment);
    };
    var scoreSmartNextIncr = 1;
    window.gameSmartScoreReset = function() {
        scoreSmartNextIncr = 100;
    };
    window.gameSmartScorePos = function() {
        window.gameAddScore(scoreSmartNextIncr);
        scoreSmartNextIncr = Math.floor(scoreSmartNextIncr * 1.2);
    };
    window.gameSmartScoreNeg = function() {
        scoreSmartNextIncr = 50;
    };

    window.gameSetStars = function(stars) {
        $('#game-stars').html('<span class="game-star"></span>'.repeat(stars));
    };

    window.gameDropStar = function() {
        var $star = $('#game-stars .game-star');
        $($star.get(0)).removeClass('game-star');
        window.playSound('dead.wav');

        return $star.length <= 1;
    };

    var showWord = function($element, word, ruby) {
        if (ruby !== undefined) {
            word = word + ' | ' + ruby;
        }
        $element.empty().append(
            $('<span></span>').text(word)
            .wrap('<span></span>').parent()
        ).removeClass('animate');
        // Reflow: https://css-tricks.com/restart-css-animation/
        $element[0].offsetWidth = $element[0].offsetWidth;
        $element.addClass('animate');
    };

    window.gameShowWord1 = function(word, ruby) {
        showWord($('#game-word1'), word, ruby);
    };

    window.gameShowWord2 = function(word, ruby) {
        showWord($('#game-word2'), word, ruby);
    };

    window.gameShowScoreboard = function(totalStars, retry, next) {
        // Clean up
        window.clearInterval(countdownInterval);
        window.gameClearScoreInterval();

        $('#scoreboard').modal({
            backdrop: 'static',
            keyboard: false
        });

        var stars = $('#game-stars .game-star').length;
        var grayStars = Math.max(0, totalStars - stars);

        $('#scoreboard-score').text(score);
        $('#scoreboard-stars').html(
            '<img src="img/star.png">'.repeat(stars) +
            '<img src="img/star.png" class="grayscale">'.repeat(grayStars)
        );

        $('#scoreboard-retry').on('click.game', function() {
            $('.scoreboard-button').off('click.game');
            retry();
        });

        $('#scoreboard-home').on('click.game', function() {
            $('.scoreboard-button').off('click.game');
            window.showList();
        });

        $('#scoreboard-next').on('click.game', function() {
            $('.scoreboard-button').off('click.game');
            next();
        });
    };

    window.showFlippedCard = function($img, text, ruby) {
        var transform = $img.css('transform') || '';
        var $innerDiv = $('<div></div>').append(
            ruby === undefined ? $('<span></span>').text(text) : $('<ruby></ruby>')
                .append($('<rb></rb>').append($('<span></span>').text(text)))
                .append('<rp> | </rp>')
                .append($('<rt></rt>').text(ruby))
        );
        var $div = $('<div></div>').data('img', $img)
            .data('index', $img.data('index'))
            .attr('class', $img.attr('class')).width($img.width())
            .css('transform', (transform == 'none' ? '' : transform) + ' rotateY(180deg)')
            .append($innerDiv);
        $img.replaceWith($div);
        $innerDiv.height($div.height()); // Browser bug to calculate height incorrectly?
        return $div;
    };

    window.showOriginalCard = function($div) {
        var $img = $div.data('img').data('index', $div.data('index'));
        $div.replaceWith($img);
        return $img;
    };

    window.rotateImage = function() {
        var deg = (Math.random() - 0.5) * 30;
        $(this).data('deg', deg).css('transform', 'rotate(' + deg + 'deg)');
    };

    window.rotateImageBack = function($img, duration) {
        $({deg: $img.data('deg')}).animate({deg: 0}, {
            duration: duration,
            step: function(now) {
                $img.css('transform', 'rotate(' + now + 'deg)');
            }
        });
    };

    var audioElement = document.createElement('audio');
    window.playSound = function(name) {
        audioElement.src = 'audio/' + name;
        audioElement.play();
    };
    window.playDataSound = function(id, name) {
        audioElement.src = 'data/' + id + '/' + name;
        audioElement.play();
    };
})(jQuery);
