chrome.runtime.onMessage.addListener(async function (request, sender) {
  await import('../lib/jquery-3.3.1.js');
  // console.log(a)
  // console.log(hd)
  //console.log(request)

  //Receive command from background and trigger handlers
  if (!$("body").hasClass("processed") && request.purpose == 'pageUpdate') {
    $("body").addClass("processed");
    console.log('received handlers and request');
    a = await import('../doc_handler/handler.js');
    a.pageHandler.process(request.url);
  } else {}
});

chrome.runtime.onMessage.addListener(function (request, sender) {
  switch (request.type) {
    case "set_complete":
      {
        for (var n in request.event_id) {
          var event_id = request.event_id[n];
          checkboxid = event_id;
          document.getElementById(checkboxid).checked = true;
        }
        break;
      }
  }
});