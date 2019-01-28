/*!
 * Managebaker
 * https://padlet.com/xyliu_felix/6h9wckhmchnp
 * Version: 3.1.1
 *
 * Copyright 2018 Managebaker Contributors
 * Released under the Apache license
 * https://github.com/Feliconut/Managebaker/blob/master/LICENSE
 */

//Content Script in all managebac domain
/*PSEUCODE:

import assignment,dash1board

Event locationChange:
    if location == Assignment:
        assignmentProcess()
    if location == Dashboard:
        dashboardProcess()

Event error:
    refresh()
*/
//从background.js 接受Message并call function
chrome.runtime.onMessage.addListener(function (request, sender) {
  if ($("body").hasClass("processed")) {
    return 0
  } else {
    $("body").addClass("processed");
    if (request.type == "assignment") {
      assignment();
      eventHandler();
    }
    if (request.type == "dashboard") {
      dashboard();
      //getData((data) => { console.log(data) });
    }
  }
});

function change_complete_status(id) {
  alert(id);
  alert(document.getElementById(id).checked);
}


function add_general_style() {
  $(".school-name").attr("href", "javascript:show_todolist();");
  $(".school-name").html('<font size="5" color="#FF7F00"><b>T O D O</b></font>');
  $(".line").addClass("mdc-list-item");
  $(".line").each(function () {
    var string = $(this).find("a").attr("href");
    var class_id = string.slice(17, 25);
    var event_id = string.slice(38, 50);
    $(this).append(
      '<div class="mdc-checkbox"> <input type="checkbox" class="mdc-checkbox__native-control" id="' + event_id + '_completed" onclick="change_complete_status(' + event_id + ')"/> <div class="mdc-checkbox__background"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> </div>'
    );
    get_event_status(event_id);
  });
}

function add_dashboard_Style() {
  add_general_style();
}