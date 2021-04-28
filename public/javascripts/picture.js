$(document).ready(function () {
    $('#pictureForm').on('submit', function(e) {
        e.preventDefault();

        const current = window.location.href;

        $.ajax({
            type: 'PUT',
            url: current,
            enctype: 'multipart/form-data',
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {
                if (response === 'changed') {
                    location.href = current;
                } else pictureAlertHandler(response);
            }
        });
    });
});


function pictureAlertHandler(alert) {
    // reset errors
    $('.file-error').css('opacity', '0');

    if (alert === 'not-chosen') displayAlert('file', 'Choose your picture first.');
    else if (alert === 'file-type') displayAlert('file', 'Invalid file type. only jpg, jpeg, png and webp image files are allowed.')
    else if (alert === 'limit-size') displayAlert('file', 'Picture size must be less than 5MB.');
};