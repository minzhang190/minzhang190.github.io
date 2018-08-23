(function($) {
    var roundId = 0;

    var playRound = function(id, gameData, nextRound, retry, next) {
        if (!$.isArray(gameData)) {
            gameData = [gameData];
        }
        var thisRoundId = ++roundId;
        var gameAnswerIndex = Math.floor(Math.random() * gameData.length);
        var gameAnswer = gameData[gameAnswerIndex];

        window.gameShowWord2(gameAnswer.text, gameAnswer.ruby);

        window.playDataSound(id, gameAnswer.audio);

        var $body = $('#game-body').empty();

        var clicked = false;
        var lastDrop = function() {
            if (clicked || thisRoundId != roundId) {
                return;
            }

            if (window.gameDropStar()) {
                window.gameCancelCountdown();
                window.gameShowScoreboard(3, retry, next);
                return;
            }

            window.setTimeout(function() {
                if (thisRoundId == roundId) {
                    nextRound();
                }
            }, 1000);
        };

        var clickCard = function() {
            if (clicked || thisRoundId != roundId) {
                return;
            }
            clicked = true;

            $('.game3-card-img').off('click');

            var $selectedImg = $(this);
            var selectedIndex = $selectedImg.data('index');
            var dropStar = false;

            if (selectedIndex == gameAnswerIndex) {
                window.gameSmartScorePos();

                // We're going to immediately flip the card anyway
                window.playDataSound(id, gameAnswer.audio);
            } else {
                window.gameSmartScoreNeg();
                dropStar = window.gameDropStar();
            }

            $selectedImg.parents('.game3-card-wrap').addClass('stop');
            $selectedImg.parents('.game3-card-show').addClass('execute');
            $('.game3-card').not($selectedImg.parents('.game3-card')).addClass('fadeout');

            window.setTimeout(function() {
                window.showFlippedCard($selectedImg, gameData[selectedIndex].text, gameData[selectedIndex].ruby);
            }, 300); // cubic-bezier(.25,.1,.25,1) => 30% time @ 50% position

            window.setTimeout(function() {
                if (thisRoundId != roundId) {
                    return;
                }
                if (dropStar) {
                    window.gameCancelCountdown();
                    window.gameShowScoreboard(3, retry, next);
                } else {
                    nextRound();
                }
            }, 2000);
        };

        $.each(gameData, function(i) {
            var thisData = this;

            $img = $('<img class="game3-card-img">')
                .data('index', i).click(clickCard)
                .attr('src', 'data/' + id + '/' + this.image)
                .addClass('border border-dark rounded').appendTo($body)
                .wrap('<div class="game3-card"></div>')
                .wrap('<div class="game3-card-wrap game3-card-wrap1"></div>')
                .wrap('<div class="game3-card-wrap game3-card-wrap2"></div>')
                .wrap('<div class="game3-card-wrap game3-card-wrap3"></div>')
                .wrap('<div class="game3-card-show game3-card-magnify"></div>')
                .wrap('<div class="game3-card-show game3-card-flip"></div>')

            // Animation schedule: card flies 4s, each card delay 1s.
            var totalTime = 4 + gameData.length - 1;
            var startPoint = 100 * i / totalTime + '%';
            var midPoint = 100 * (i + 2) / totalTime + '%';
            var endPoint = 100 * (i + 4) / totalTime + '%';
            var keyframe1 = {
                name: 'game3-card-wrap1-' + i,
                from: {
                    transform: 'none'
                },
                to: {
                    transform: 'none'
                }
            };
            keyframe1[startPoint] = {
                transform: 'translateX(' + (Math.random() * 100 - 50) + 'vw)'
            };
            keyframe1[endPoint] = {
                transform: 'translateX(' + (Math.random() * 100 - 50) + 'vw)'
            };
            var keyframe2 = {
                name: 'game3-card-wrap2-' + i,
                from: {
                    transform: 'translateY(200vh)'
                },
                to: {
                    transform: 'translateY(200vh)'
                }
            };
            keyframe2[startPoint] = keyframe2[endPoint] = {
                transform: 'translateY(' + (Math.random() * 20 + 100) + 'vh)'
            };
            keyframe2[midPoint] = {
                transform: 'translateY(' + (Math.random() * 20 - 20) + 'vh)'
            };
            var keyframe3 = {
                name: 'game3-card-wrap3-' + i,
                from: {
                    transform: 'none'
                },
                to: {
                    transform: 'none'
                }
            };
            keyframe3[startPoint] = {
                transform: 'rotate(' + (Math.random() * 120 - 60) + 'deg)'
            };
            keyframe3[endPoint] = {
                transform: 'rotate(' + (Math.random() * 120 - 60) + 'deg)'
            };
            $.keyframe.define([keyframe1, keyframe2, keyframe3]);

            $img.parents('.game3-card-wrap1').playKeyframe({
                name: 'game3-card-wrap1-' + i,
                duration: totalTime + 's',
                timingFunction: 'linear'
            });

            $img.parents('.game3-card-wrap2').playKeyframe({
                name: 'game3-card-wrap2-' + i,
                duration: totalTime + 's',
                timingFunction: 'ease-in-out'
            });

            $img.parents('.game3-card-wrap3').playKeyframe({
                name: 'game3-card-wrap3-' + i,
                duration: totalTime + 's',
                timingFunction: 'linear',
                complete: (i == gameData.length - 1) ? lastDrop : function() {}
            });
        });
    };

    var playGame = function(id, data, countdown) {
        countdown = countdown || 60;

        window.gameSmartScoreReset();

        var replay = function(timeIncrement) {
            return function() {
                window.gameInitScore(0);
                window.gameSetStars(3);

                playGame(id, data, countdown + timeIncrement);
            };
        };
        var retry = replay(0);
        var next = replay(60);

        var nextRound = function() {
            playRound(id, shuffle.pick(data, {picks: 5}), nextRound, retry, next);
        };

        nextRound();

        window.gameCountdown(countdown, function() {
            roundId++; // This intercepts all pending game events
            window.gameShowScoreboard(3, retry, next);
        });
    };

    window.showGame3 = function(id) {
        var data = window.data[id].slice();

        if (data.length < 5) {
            $('<div class="alert alert-danger" role="alert">No enough words to play this game.</div>').prependTo('#root');
            return;
        }

        window.showGame();

        window.gameInitScore(0);
        window.gameSetStars(3);

        playGame(id, data);
    };
})(jQuery);
