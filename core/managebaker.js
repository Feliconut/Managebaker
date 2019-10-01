chrome.runtime.onMessage.addListener(async function (request, sender) {
  await import('../lib/jquery-3.3.1.js');
  if (!$("body").hasClass("processed") && request.purpose == 'pageUpdate') {
    $("body").addClass("processed");
    console.log('received handlers and request');
    a = await import('../doc_handler/handler.js');
    a.pageHandler.process(request.url);
  } else { }
});

chrome.runtime.onMessage.addListener(function (request, sender) {
  switch (request.type) {
    case "set_checkbox_status":
      {
        document.getElementById(request.event_id).disabled = !request.data.success;
        document.getElementById(request.event_id).indeterminate = !request.data.success;
        document.getElementById(request.event_id).checked = request.data.checked;
        break;
      }

    case "ClassColor": {
      var classes = request.data;
      $(" #menu .nav-menu li.parent>ul.nav.with-indicators li:not(.more) a").each(function () {
        var class_id = ($(this).attr("href").split("/"))[3]
        for (var k in classes) {
          if (classes[k].id == class_id) {
            $(this).find(".indicator").css("background", classes[k].color)
          }
        }
      })
      break;
    }
  }
});