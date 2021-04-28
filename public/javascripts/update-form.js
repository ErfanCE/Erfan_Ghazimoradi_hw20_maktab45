$(document).ready(function () {
    // edit blogger profile
    $("#updateForm").submit(function (e) {
        e.preventDefault();

        // edited blogger info
        const data = {
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            username: $("#username").val(),
            gender: $("#gender").val(),
            phoneNumber: $("#phoneNumber").val(),
        };

        $.ajax({
            type: "PATCH",
            url: "http://localhost:8000/account",
            data,
            success: function (response) {
                console.log(response);
                if (response === "updated") {
                    $(`.alter-result`).text("Profile Updated");
                    $(`.alter-result`).css("background-color", "green");
                    $(`.alter-result`).css("opacity", "1");
                    $("#modal-container").addClass("out");
                    $("body").removeClass("modal-active");
                    $("#createForm input").val("");

                    setTimeout(function () {
                        location.href = "http://localhost:8000/account";

                        $(`.alter-result`).css("opacity", "1");
                    }, 2000);
                } else updateAlertHandler(response);
            }
        });
    });

    // remove blogger account
    $("#deleteAccount").click(function (e) {
        e.preventDefault();

        $.ajax({
            type: "DELETE",
            url: "http://localhost:8000/account",
            success: function (response) {
                if (response === "deleted") {
                    $(`.alter-result`).text("Account Deleted");
                    $(`.alter-result`).css("background-color", "#b30000");
                    $(`.alter-result`).css("opacity", "1");

                    setTimeout(function () {
                        location.href = "http://localhost:8000/account";
                        $(`.alter-result`).css("opacity", "0");
                    }, 2000);
                }
            }
        });
    });
});


function updateAlertHandler(alert) {
    // reset errors
    $(".update-error").css("opacity", "0");

    alert.forEach((err) => {
        if (err.includes("firstname")) displayAlert("firstname", err);
        if (err.includes("lastname")) displayAlert("lastname", err);
        if (err.includes("username")) displayAlert("username", err);
        if (err.includes("gender")) displayAlert("gender", err);
        if (err.includes("phoneNumber")) displayAlert("phoneNumber", err);
    });
};