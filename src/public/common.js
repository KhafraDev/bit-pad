function request(url, options = {}, cb) {
    if(!('fetch' in window) || !('Promise' in window) && ('XMLHttpRequest' in window)) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(this.readyState === 4) {
                try {
                    var json = JSON.parse(req.response);
                    return cb(null, json);
                } catch {
                    return cb('Non-JSON response from server.');
                }
            }
        };
        req.onabort = function() { return cb('Request aborted!') };
        req.onerror = function() { return cb('An error occured!') };
        req.open(options.method || 'GET', url, true);
        for(var i = 0; i < Object.keys(options.headers || {}); i++) {
            var key = Object.keys(options.headers)[i];
            req.setRequestHeader(key, options.headers[key]);
        }
        req.send(options.body);
    } else {
        try {
            return fetch(url, options)
                .then(function(r) { return r.json() })
                .then(function(d) { return cb(null, d) });
        } catch(err) {
            return cb(err);
        }
    }
}

function modal(m, display) {
    var modal = document.querySelector('.modal');
    var title = document.querySelector('.modal-title');

    if(m) {
        title.textContent = m;
    }

    modal.setAttribute('style', 'display: ' + (display || 'block') + ';');
}

window.addEventListener('load', function() {
    document.getElementById('closeModal').addEventListener('click', function(e) {
        e.preventDefault();
        modal(null, 'none');
    });
});