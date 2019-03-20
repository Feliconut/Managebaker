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
  console.log(request)
  switch (request.type) {
    case "set_checkbox_status":
      {

        document.getElementById(request.event_id).disabled = !request.data.success;
        document.getElementById(request.event_id).indeterminate = !request.data.success;
        document.getElementById(request.event_id).checked = request.data.checked;
      }
      break;

  }
});