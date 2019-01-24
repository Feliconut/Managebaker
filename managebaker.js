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
  if (request.type == "assignment") {
    assignment();
  }
  if (request.type == "dashboard") {
    //dashboard();
    //getData((data) => { console.log(data) });
  }
});




function addStyle() {
  $(".line").addClass("mdc-list-item");
  
  //$(".line").addClass("mdc-ripple-upgraded");
  //防止重复添加checkbox

  if (!$(".line").has("input").length) {
    $("div.line").append(
      '<div class="mdc-checkbox"> <input type="checkbox" checked="checked" class="mdc-checkbox__native-control" id="" /> <div class="mdc-checkbox__background"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> </div>'
    );

  }
}