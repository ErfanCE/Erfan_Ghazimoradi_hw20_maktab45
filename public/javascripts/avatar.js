$(document).ready(function () {
    $('#avatarForm').on('submit', function(e) {
        e.preventDefault();

        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8000/account/avatar',
            enctype: 'multipart/form-data',
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (response) {

                if (response === 'avatar-change') {
                    $(`.alter-result`).text('Avatar Updated.');
                    $(`.alter-result`).css('background-color', 'green');
                    $(`.alter-result`).css('opacity', '1');

                    setTimeout(function() {
                        location.href = 'http://localhost:8000/account';
                    }, 1500);
                } else avatarAlertHandler(response);
            }
        });
    });

    $('#avatarRemove').on('click', function(e) {
        e.preventDefault();

        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8000/account/avatar',
            success: function (response) {
                if (response === 'avatar-remove') {
                    $(`.alter-result`).text('Avatar Removed.');
                    $(`.alter-result`).css('background-color', '#b30000');
                    $(`.alter-result`).css('opacity', '1');

                    setTimeout(function() {
                        location.href = 'http://localhost:8000/account';
                    }, 1500);
                } else if (response === 'avatar-default') avatarAlertHandler(response);
            }
        });
    });
});


function avatarAlertHandler(alert) {
    // reset errors
    $('.file-error').css('opacity', '0');

    if (alert === 'not-chosen') displayAlert('file', 'Choose your avatar first.');
    else if (alert === 'file-type') displayAlert('file', 'Invalid file type. only jpg, jpeg, png, gif and webp image files are allowed.')
    else if (alert === 'limit-size') displayAlert('file', 'Avatar size must be less than 1MB.');
    else if (alert === 'avatar-default') displayAlert('file', 'No avatar set yet.');
}