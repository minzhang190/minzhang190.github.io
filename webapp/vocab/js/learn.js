(function($) {
    var playLearn = function(id) {
        var data = window.data[id].slice(); // Really need slice?

        var $root = $('#root').empty();
        var $learn = window.$learn.clone().appendTo($root);
        // Call it game even if this is learn
        $('html').addClass('game-in-progress');

        var currentIndex = 0;

        for (var i = data.length - 1; i >= 0; i--) {
            $('<img class="learn-card-img">')
                .attr('src', 'data/' + id + '/' + data[i].image)
                .attr('id', 'learn-card-img-' + i)
                .appendTo('#learn-left');
        }

        $('.learn-card-img').addClass('border border-dark rounded')
            .wrap('<div class="learn-card"></div>').each(window.rotateImage);

        var playRow = function($element, text) {
            $element.removeClass('enter');
            // Reflow: https://css-tricks.com/restart-css-animation/
            $element[0].offsetWidth = $element[0].offsetWidth;
            $element.text(text);
            $element.addClass('enter');
        };

        var playCard = function(index) {
            window.playDataSound(id, data[index].audio);
            playRow($('#learn-ruby'), data[index].ruby);
            playRow($('#learn-text'), data[index].text);
            playRow($('#learn-explain'), data[index].explain);
        };

        playCard(0);

        $('#learn-left').click(function() {
            playCard(currentIndex);
        });

        $('#learn-right').click(function() {
            if (currentIndex == data.length - 1) {
                showNext(id);
                return;
            }
            $('#learn-card-img-' + currentIndex).parent().addClass('exit');
            playCard(++currentIndex);
        });
    };

    var showNext = function(id) {
        $('#learnboard').modal({
            backdrop: 'static',
            keyboard: false
        });

        $('#learn-retry').on('click.learn', function() {
            $('.learn-button').off('click.learn');
            playLearn(id);
        });

        $('#learn-home').on('click.learn', function() {
            $('.learn-button').off('click.learn');
            window.showList();
        });

        $('#learn-next').on('click.learn', function() {
            $('.learn-button').off('click.learn');
            window.showGame1(id);
        });
    };

    window.showLearn = function(id) {

        playLearn(id);
    };
})(jQuery);
