function displayAlert(property, message) {
    console.log(message);
    $(`.${property}-error`).text(message);
    $(`.${property}-error`).css("opacity", "1");
};