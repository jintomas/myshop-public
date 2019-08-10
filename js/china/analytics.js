$(document).ready(function () {
    $('#monopolyBase').on('click', function (eventObject) {
        console.log(eventObject.target.nodeName);
        $.get({
            url: 'http://localhost:8080/stocks/',
            success: function (response) {
                console.log(response)
            },
            error: function (error) {
                console.log(error)
            }
        });
    });
});