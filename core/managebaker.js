// import("../doc_handler/handler.js")

var RUNTIME_PATH = chrome.runtime.getURL("./")

chrome.runtime.onMessage.addListener(function (request, sender) {
  import(RUNTIME_PATH + 'lib/jquery-3.3.1.js').then(
    import(RUNTIME_PATH + 'doc_handler/handler.js').then((
      a
    ) => {
      var globalPage = a.globalPage
      var assignmentList = a.assignmentList
      var assignmentSingle = a.assignmentSingle
      var dashboard = a.dashboard
      //Receive command from background and trigger handlers
      if (!$("body").hasClass("processed")) {
        $("body").addClass("processed");
        switch (request.type) {
          case "assignmentList":
            {
              assignmentList.run("assignmentList")
              break;
            }
          case "assignmentSingle":
            {
              // import assignmentSingle from '../doc_handler/handler'
              assignmentSingle.run("assignmentSingle");
              break;
            }
          case "dashboard":
            {
              //dashboard();
              dashboard.run("dashboard");
              break;
            }
          case "other":
            {
              globalPage.run("globalPage");
              break;
            }
          default:
            {
              throw "wrong message: " + request.type
            }
        }
      } else {
      }
    }));
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