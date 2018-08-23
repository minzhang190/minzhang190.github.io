(function($) {
    var rounds = 0;

    var playGame = function(id, data) {
        var gameData = shuffle.pick(data, {picks: 3});
        var gameAnswerIndex = Math.floor(Math.random() * 3);
        var gameAnswer = gameData[gameAnswerIndex];

        window.gameShowWord1(gameAnswer.text, gameAnswer.ruby);

        window.playDataSound(id, gameAnswer.audio);

        var nextRound = function() {
            if (++rounds < 10) {
                $('div.game1-card-img').addClass('fadeout');
                window.setTimeout(function() {
                    playGame(id, data);
                }, 1000);
            } else {
                gameOver();
            }
        };

        var gameOver = function() {
            window.gameShowScoreboard(3, function() {
                rounds = 0;

                window.gameInitScore(0);
                window.gameSetStars(3);

                playGame(id, data);
            }, function() {
                window.showGame2(id);
            });
        };

        var clicked = false;
        var clickCard = function() {
            if (clicked) {
                return;
            }
            clicked = true;
            var dropStar = false;

            window.gameCancelCountdown();
            $('.game1-card-img').off('click');

            var $selectedImg = $(this);
            var cardIndex = $selectedImg.data('index');
            if (cardIndex == gameAnswerIndex) {
                window.gameSmartScorePos();
            } else {
                window.gameSmartScoreNeg();
                dropStar = window.gameDropStar();
            }

            // The clicked action is to always move the clicked card to the center and flip,
            // and have other cards exit. No matter whether it's correct or not.

            var $selectedCard = $selectedImg.parents('.game1-card').addClass('center');
            $('.game1-card').removeClass('enter').not($selectedCard).addClass('exit');

            // Show back of the card during flipping
            window.setTimeout(function() {
                window.showFlippedCard($selectedImg, gameData[cardIndex].text, gameData[cardIndex].ruby);

                if (cardIndex == gameAnswerIndex) {
                    window.playDataSound(id, gameAnswer.audio);
                }
            }, 1300); // cubic-bezier(.25,.1,.25,1) => 30% time @ 50% position

            window.rotateImageBack($selectedImg, 1000);

            window.setTimeout(dropStar ? gameOver : nextRound, 3000);
        };

        $('#game-body').empty()
        .append(
            $('<div class="col game1-col game1-col-left"></div>').append(
                $('<img class="game1-card-img">')
                .attr('src', 'data/' + id + '/' + gameData[0].image)
                .data('index', 0).click(clickCard)
            )
        )
        .append(
            $('<div class="col game1-col game1-col-center"></div>').append(
                $('<img class="game1-card-img">')
                .attr('src', 'data/' + id + '/' + gameData[1].image)
                .data('index', 1).click(clickCard)
            )
        )
        .append(
            $('<div class="col game1-col game1-col-right"></div>').append(
                $('<img class="game1-card-img">')
                .attr('src', 'data/' + id + '/' + gameData[2].image)
                .data('index', 2).click(clickCard)
            )
        )

        $('.game1-card-img').addClass('border border-dark rounded')
            .wrap('<div class="game1-card"></div>').each(window.rotateImage);

        $('.game1-card').addClass('enter');

        window.gameCountdown(10, function() {
            if (clicked) {
                return;
            }
            clicked = true;

            $('#game1-card-img').off('click');
            var dropStar = window.gameDropStar();

            // Flip each card in place

            $('.game1-card').removeClass('enter').addClass('flip');

            $.each([0, 1, 2], function() {
                var cardIndex = this;
                var $img = $($('.game1-card-img').get(cardIndex));

                // Show back of the card during flipping
                window.setTimeout(function() {
                    window.showFlippedCard($img, gameData[cardIndex].text, gameData[cardIndex].ruby);
                }, 1300); // cubic-bezier(.25,.1,.25,1) => 30% time @ 50% position

                window.rotateImageBack($img, 1000);
            });

            window.setTimeout(dropStar ? gameOver : nextRound, 3000);
        });
    };

    window.showGame1 = function(id) {
        var data = window.data[id].slice();

        if (data.length < 3) {
            $('<div class="alert alert-danger" role="alert">No enough words to play this game.</div>').prependTo('#root');
            return;
        }

        window.showGame();

        rounds = 0;
        window.gameInitScore(0);
        window.gameSmartScoreReset();
        window.gameSetStars(3);

        playGame(id, data);
    };
})(jQuery);
