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
    eventHandler()
  }
  if (request.type == "dashboard") {
    //dashboard();
    //getData((data) => { console.log(data) });
  }
});