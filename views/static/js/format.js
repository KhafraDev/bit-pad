function save(quill) {
    const c = quill.getContents(); 

    $.post({
        url: '../save',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ html: c.ops, key: window.location.href.split('/').pop() })
    }).done(function(data) {
        if(data && data.success) {
            showModal('Changes Saved');
        } else {
            showModal('An error occured!', data.fail);
        }
    });
}

function showModal(t, d) {
    document.querySelector('.modal-title').textContent = t;
    if(d) {
        document.getElementById('errorMessage').textContent = d;
    }
    $('.modal').modal();
}

function format(e) {
    e.style.height = '5px';
    e.style.height = e.scrollHeight + 'px';
}