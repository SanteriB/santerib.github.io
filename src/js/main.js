document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelector('#tabs').addEventListener('click', function () {
        _tjs.ajax.get('.tutorial_content', '/manuals/tabs.html');
    });
    document.querySelector('#ajax').addEventListener('click', function () {
        _tjs.ajax.get('.tutorial_content', '/manuals/ajax.html');
    });
});
