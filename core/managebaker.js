/*
DESCRIPTION


*/
const RUNTIME_PATH = chrome.runtime.getURL("./")

import {
  assignmentList,
  assignmentSingle
} from(RUNTIME_PATH + 'doc_handler/handler.js')
import(RUNTIME_PATH + 'lib/jquery-3.3.1.js')

//What's this for?
chrome.runtime.sendMessage({
  status: 'on'
});


//Receive command from background and trigger handlers
chrome.runtime.onMessage.addListener(function (request, sender) {
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
          assignmentSingle.run("assignmentSingle")
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