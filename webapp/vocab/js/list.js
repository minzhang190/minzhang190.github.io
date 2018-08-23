(function($) {
    window.showList = function() {
        var $root = $('#root').empty();
        var $list = $('<ul class="list-group" id="list"></ul>').appendTo($root);
        $('html').removeClass('game-in-progress');

        $.each(window.index, function() {
            var json = this;
            var $btnGroup = $('<div class="btn-group"></div>');

            $('<button type="button" class="btn btn-secondary">Game1</button>').click(function() {
                window.showGame1(json.id);
            }).appendTo($btnGroup);

            $('<button type="button" class="btn btn-secondary">Game2</button>').click(function() {
                window.showGame2(json.id);
            }).appendTo($btnGroup);

            $('<button type="button" class="btn btn-secondary">Game3</button>').click(function() {
                window.showGame3(json.id);
            }).appendTo($btnGroup);

            $('<li class="list-group-item d-flex justify-content-between"></li>')
            .append($('<span></span>').text(json.name))
            .append($btnGroup)
            .appendTo($list);
        });
    };
})(jQuery);
