$("#username").on('keyup', function(e) {
    $("#username").val( $(this).val().replace(/ /g, "_") );
});