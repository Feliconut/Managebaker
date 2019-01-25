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
      eventHandler()
    }
    if (request.type == "dashboard") {
      dashboard();
      //getData((data) => { console.log(data) });
    }
  }
});





function add_general_style() {
  $(".school-name").attr("href", "show_todolist();");
  $(".school-name").html('<font size="5" color="#FF7F00"><b>TODO</b></font>');
  $(".profile-link a").text('');
  console.log("1");
}

function add_assignment_Style() {
  add_general_style();
  $(".line").addClass("mdc-list-item");
  //防止重复添加checkbox
  $("div.content-block > hr.divider").after(
    '<div class="assignments-progress-chart gradebook-progress-chart" style="height: 200px" ><canvas id="scoreChart" width="50%" height="100%"></canvas></div>' +
    '<hr class="divider"></hr>'
  );
  $(".line").each(function () {
    var string = $(this).find("a").attr("href");
    var class_id = string.slice(17, 25);
    var event_id = string.slice(38, 50);
    console.log(class_id, event_id);
    $(this).append(
      '<div class="mdc-checkbox"> <input type="checkbox" class="mdc-checkbox__native-control" id="' + event_id + '_completed"/> <div class="mdc-checkbox__background"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> </div>'
    );
  });

  /*
    document.getElementById("20401611_completed").checked = true;
    
    var type = document.getElementById("20401611_completed");
    if (type.checked) {
      //alert("1")
    }
    */
  //document.getElementById("").disabled=true;
}


function add_dashboard_Style() {
  add_general_style();
}