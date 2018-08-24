(function($) {
    $(function() {
        window.$game = $("#game").show().remove();
        window.$learn = $("#learn").show().remove();

        $('<div class="alert alert-primary" role="alert">Loading data...</div>').appendTo('#root');

        $.get('data/index.json')
        .done(function(json) {
            window.index = json;
            window.data = {};

            var load = function(index) {
                if (index == json.length) {
                    window.showList();
                    return;
                }

                var path = 'data/' + json[index].id + '/index.json';

                $.get(path)
                .done(function(json) {
                    window.data[window.index[index].id] = json;
                    load(index + 1);
                })
                .fail(function(xhr, status, errorThrown) {
                    $('<div class="alert alert-danger" role="alert">Error loading ' + path + '.</div>').appendTo('#root');
                });
            };

            load(0);
        })
        .fail(function(xhr, status, errorThrown) {
            $('<div class="alert alert-danger" role="alert">Error loading data/index.json.</div>').appendTo('#root');
        });
    });
})(jQuery);
