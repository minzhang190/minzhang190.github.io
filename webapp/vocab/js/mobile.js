(function($) {
    // Make it easier to debug (on computer) and easier to play (on mobile devices)
    if (!/Mobi/.test(navigator.userAgent)) {
        return;
    }

    $('body').css({
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-moz-user-select': '-moz-none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    }).on('touchmove', function(e) {
        e.preventDefault();
    });

    $('#css-dynamic').text('@media screen and (orientation: portrait) {'
        + '#portrait-overlay { display: block !important; }'
        + '#root { display: none !important; }'
    + '}');

    screenfull.request();

})(jQuery);
