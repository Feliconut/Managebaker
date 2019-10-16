window.mdc.autoInit();
new WOW().init();

$(function () {
    var url = window.location.toString();
    var id = url.split("#")[1];
    if (id) {
        var t = $("#" + id).offset().top;
        $(window).scrollTop(t);
    }
});

fetch("/API/public/info/usernumber").then(
    response => response.json().then(
        function (data) {
            var usernumber = data["data"]
            $("#usernumber").text(usernumber)
        }))

fetch("/API/public/info/version").then(
    response => response.json().then(
        function (data) {
            var version = data["data"]
            $("#version").text(version)
        }))