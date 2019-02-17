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