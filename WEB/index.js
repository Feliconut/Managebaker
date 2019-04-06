new WOW().init();

$(function(){
    var url = window.location.toString();
    var id = url.split("#")[1];
    if(id){
        var t = $("#"+id).offset().top;
        $(window).scrollTop(t);
    }		   
});