$(document).ready(function () {
    $('#updateArticle').on('submit', function(e) {
        e.preventDefault();

        const currentUrl = window.location.href;

        const data = {
            title: $('#title').val(),
            description: $('#description').val(),
            content: $('#content').val(),
        };

        $.ajax({
            type: 'PATCH',
            url: currentUrl,
            data,
            success: function (response) {
                if (response === 'updated') {
                    location.href = currentUrl;
                } else updateArticleAlert(response);
            }
        });
    });

    $('#removeArticle').on('click', function () {
        const currentUrl = window.location.href;

        $.ajax({
            type: 'DELETE',
            url: currentUrl,
            success: function (response) {
                if (response === 'deleted') {
                    location.href = 'http://localhost:8000/account/article';
                }
            }
        });
    });
});


function updateArticleAlert(alert) {
    // reset errors
    $(".update-error").css("opacity", "0");

    alert.forEach((err) => {
        if (err.includes("title")) displayAlert("title", err);
        if (err.includes("description")) displayAlert("description", err);
        if (err.includes("content")) displayAlert("content", err);
    });
};