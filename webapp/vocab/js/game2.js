(function($) {
    var playGame = function(id, data) {
        var gameData = shuffle(data);
        var gameUnusedData = {}; // Populated in insertCard
        var gameAnswer = null;
        var gameAnswerIndex = null;

        window.gameInitScore(0);
        window.gameSmartScoreReset();
        window.gameSetStars(3);

        var $body = $('#game-body').empty();
        var $row = $('<div class="row w-100 align-items-center game2-row"></div>').appendTo($body);

        var countdownEnd = function() {
            if (clicked) {
                return;
            }
            clicked = true;

            var dropStar = window.gameDropStar();

            // Flip the correct card

            $correctCard = $($('.game2-card').get(gameAnswerIndex));

            flipCard($correctCard, gameData[gameAnswerIndex].text, gameData[gameAnswerIndex].ruby, 1000, function() {
                flipCardBack($correctCard, 0, dropStar ? gameOver : nextCard);
            });
        };

        var nextCard = function() {
            var unusedIndices = Object.keys(gameUnusedData);

            if (unusedIndices == 0) {
                gameOver();
                return;
            }

            gameAnswerIndex = shuffle.pick(unusedIndices);
            gameAnswer = gameData[gameAnswerIndex];
            window.gameShowWord1(gameAnswer.text, gameAnswer.ruby);
            window.playDataSound(id, gameAnswer.audio);

            window.gameCountdown(10, countdownEnd);
            clicked = false;
        };

        var gameOver = function() {
            window.gameShowScoreboard(3, function() {
                playGame(id, data);
            }, function() {
                window.showGame3(id);
            });
        };

        var flipCard = function($card, text, ruby, delay, callback) {
            var $img = $card.find('.game2-card-img');
            $card.removeClass('enter flipback').addClass('flip');

            // Show back of the card during flipping
            window.setTimeout(function() {
                showFlippedCard($img, text, ruby);
            }, 300); // cubic-bezier(.25,.1,.25,1) => 30% time @ 50% position

            if (callback) {
                window.setTimeout(callback, 1000 + (delay || 0));
            }
        };

        var flipCardBack = function($card, delay, callback) {
            var $div = $card.find('.game2-card-img');
            $card.removeClass('flip').addClass('flipback');

            window.setTimeout(function() {
                showOriginalCard($div).click(clickCard);
            }, 300); // cubic-bezier(.25,.1,.25,1) => 30% time @ 50% position

            if (callback) {
                window.setTimeout(callback, 1000 + (delay || 0));
            }
        };

        var clicked = false;
        var clickCard = function() {
            if (clicked) {
                return;
            }
            clicked = true;

            window.gameCancelCountdown();

            var $img = $(this);
            var selectedIndex = $img.data('index');
            var $card = $img.parents('.game2-card');

            if (selectedIndex == gameAnswerIndex) {
                window.gameSmartScorePos();
                window.playDataSound(id, gameAnswer.audio);
                delete gameUnusedData[selectedIndex];

                flipCard($card, gameData[selectedIndex].text, gameData[selectedIndex].ruby, 1000, function() {
                    $card.removeClass('flip').addClass('exit');
                    nextCard();
                });

                return;
            }

            window.gameSmartScoreNeg();
            var dropStar = window.gameDropStar();

            // First, show the card selected by user
            flipCard($card, gameData[selectedIndex].text, gameData[selectedIndex].ruby, 1000, function() {
                flipCardBack($card);

                // Then, show the correct card
                $correctCard = $($('.game2-card').get(gameAnswerIndex));

                flipCard($correctCard, gameData[gameAnswerIndex].text, gameData[gameAnswerIndex].ruby, 1000, function() {
                    flipCardBack($correctCard, 0, dropStar ? gameOver : nextCard);
                });
            });
        };

        var insertCard = function(from, to) {
            for (var i = from; i < to; i++) {
                gameUnusedData[i] = gameData[i];
                $row.append(
                    $('<div class="col game2-col"></div>').append(
                        $('<img class="game2-card-img">')
                        .attr('src', 'data/' + id + '/' + gameData[i].image)
                        .data('index', i).click(clickCard)
                    )
                );
            }
        };
        var nrPerRow = 5, nrRows = Math.ceil(gameData.length / nrPerRow);
        for (var i = 0; i < nrRows; i++) {
            if (i > 0) {
                $row.append('<div class="w-100"></div>');
            }
            insertCard(i * nrPerRow, Math.min((i + 1) * nrPerRow, gameData.length));
        }

        $('.game2-card-img').addClass('border border-dark rounded')
            .wrap('<div class="game2-card"></div>').each(window.rotateImage);

        $('.game2-card').addClass('enter');

        // Now to play the real game
        nextCard();
    };

    window.showGame2 = function(id) {
        var data = window.data[id].slice();

        window.showGame();

        playGame(id, data);
    };
})(jQuery);
