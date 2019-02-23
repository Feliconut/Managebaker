/*
DESCRIPTION


*/

//What's this for?
chrome.runtime.sendMessage({
  status: 'on'
});


//Receive command from background and trigger handlers
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (!$("body").hasClass("processed")) {
    $("body").addClass("processed");
    switch (request.type) {
      case "assignment":
        {
          add_general_style("common");
          assignment();
          console.log("a")
          break;
        }
      case "withinassignment":
        {
          add_general_style("withinassignment");
          break;
        }
      case "dashboard":
        {
          //dashboard();
          add_general_style("common");
          console.log("dashboard")
          break;
        }
      case "other":
        {
          add_general_style();
          break;
        }
    }
  } else {
    throw "wrong message: " + request.type
  }

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