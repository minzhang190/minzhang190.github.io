(function() {
    window.useGAID = function(callback, timeout) {
        var count = (timeout || 5000) / 100;

        var interval = setInterval(function() {
            if (count-- > 0 && (!window.ga || !window.ga.getAll)) {
                return;
            }

            clearInterval(interval);

            var trackerId = 'unknown';
            if (window.ga && window.ga.getAll) {
                ga.getAll().forEach(function(tracker) {
                    var clientId = tracker.get('clientId');
                    if (clientId) {
                        trackerId = clientId;
                    }
                });
            }

            callback(trackerId);
        }, 100);
    };
})();
