$("#agree1").click(function () {
    $(".EULA").attr("style", "display:none");
    $(".data_storage").attr("style", "left:10%;margin-left:-40%;top:0;height:100%;width:80%;background:#fff;border-radius:2px;font:14px/20px Roboto,sans-serif;  margin: 24px;max-height: calc(100% - 48px);max-width: calc(100% - 48px);overflow: auto;height: calc(100% - 48px);padding: 8px;position: fixed;z-index: 10012;    box-shadow: 0 17px 17px rgba(0,0,0,.15), 0 27px 55px rgba(0,0,0,.3);");
});
$("#agree2").click(function () {
    $(".data_storage").attr("style", "display:none");
});
$('.agree').click(function () {
    var card = $(this).closest('.live-pages > div');
    var nextCard = card.next();
    card.css('display', 'none');
    nextCard.css('display', 'block');
})

$('ul.select li').click(function() {
    var li = $(this);
    li.addClass('selected');
    li.siblings().removeClass('selected');
})
