(function($) {
    $(function() {
        window.$game = $("#game").show().remove();
        window.$learn = $("#learn").show().remove();
        window.whitelist = location.search ? decodeURIComponent(location.search.substring(1).split('&')[0]).split(',') : null;

        $('<div class="alert alert-primary" role="alert">Loading data...</div>').appendTo('#root');

        $.get('data/index.json')
        .done(function(json) {
            window.index = [];
            window.data = {};

            var load = function(index) {
                if (index == json.length) {
                    window.showList();
                    return;
                }

                var key = json[index].id;
                if (window.whitelist && window.whitelist.indexOf(key) == -1) {
                    load(index + 1);
                    return;
                }

                window.index.push(json[index]);
                var path = 'data/' + key + '/index.json';

                $.get(path)
                .done(function(json) {
                    window.data[key] = json;
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
