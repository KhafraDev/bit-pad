function register() {
    const value = document.getElementById('inputCreate').value;
    if(!value.length) return false;

    $.post({
        url: 'register',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ "name": value })
    }).done(function(data) {
        if(data && data.pad) {
            window.location.href = data.pad;
        } else {
            window.location.href = '/error';
        }
    });
}