$(document).ready(function () {
    $('#createArticle').on('submit', function(e) {
        e.preventDefault();

        // use [0] for jquery array no need for DOM
        const formData = new FormData($(this)[0]);

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000/account/article',
            enctype: 'multipart/form-data',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response === 'create') {
                    location.href = 'http://localhost:8000/account/article';
                } else if (response === 'limit-size') {
                    $(".update-error").css("opacity", "0");

                    displayAlert('picture', 'picture size must be less than 5MB');
                } else if (response === 'file-type') {
                    $(".update-error").css("opacity", "0");

                    displayAlert('picture', 'Invalid file type. only jpg, jpeg, png and webp image files are allowed.');
                } else createArticleAlert(response);
            }
        });
    });
});


function createArticleAlert(alert) {
    // reset errors
    $(".update-error").css("opacity", "0");

    alert.forEach((err) => {
        if (err.includes("title")) displayAlert("title", err);
        if (err.includes("description")) displayAlert("description", err);
        if (err.includes("content")) displayAlert("content", err);
        if (err.includes("picture")) displayAlert("picture", err);
    });
};