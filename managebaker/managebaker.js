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

import assignment,dashboard,todolist

Event locationChange:
    if location == Assignment:
        assignmentProcess()
    if location == Dashboard:
        dashboardProcess()

Event error:
    refresh()

generalprocess(){
  addstyle{
    左侧Menu增加一个Tab
    TODOLIST
    Line item
  }
}

assignmentProcess(){
  
}

*/



chrome.runtime.sendMessage({
  status: 'on'
});




//从background.js 接受Message并call function
chrome.runtime.onMessage.addListener(function (request, sender) {
  if ($("body").hasClass("processed")) {
    return 0;
  } else {
    $("body").addClass("processed");
    add_general_style();
    switch (request.type) {
      case "assignment":
        {        
          assignment();
          //eventHandler("1");
          break;
        }
      case "dashboard":
        {
          //dashboard();
          console.log("dashboard")
          break;
        }
      case "other":
        {
          
          break;
        }
    }
  }
});



function add_general_style() {
  //左侧Menu增加一个Tab
  var pathString =
    "M 401 64 Q 170 84 150 300 Q 164 538 400 550 Q 571 535 604 382 L 664 401 Q 659 320 601 252 Q 517 277 462 337 L 532 361 Q 511 464 401 465 Q 248 447 241 299 Q 247 167 400 150 L 401 133 Q 227 150 221 299 Q 235 464 395 484 Q 520 479 549 369 L 587 379 Q 542 523 404 531 Q 187 527 173 300 Q 185 106 399 82 Z";
  var groupsTab = $("#menu > ul > li:nth-child(11)");
  var utilitiesTab = $(
    '<li id="utilTab1" class="parent utilities"><a><svg baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="100 0 560 600" preserveAspectRatio="xMinYMin meet"><path fill-rule="evenodd" fill="#859BBB" d="' +
    pathString +
    '"></path></svg>Utilities</a><ul id="utilTab2" class="nav" data-max-height="129px" style="max-height: 0px;"><li><a href="/student/profile">My Profile </a></li><li><a href="https://accounts.managebac.cn/">Launchpad </a></li><li><a href="/help">Help &amp; Support </a></li><li id="utilTab3"><a id="utilTab3" href="/logout">Logout </a></li></ul></li>'
  );
  utilitiesTab.insertAfter(groupsTab);
  utilitiesTab.click(() => {
    var $1 = $("#utilTab1");
    var $2 = $("#utilTab2");
    $1.toggleClass("opened");
    $2.attr(
      "style",
      $1.hasClass("opened") ? "max-height: 129px" : "max-height: 0px"
    );
  });
  $(".line").addClass("mdc-list-item");
  $(".line").each(function () {
    var string = $(this).find("a").attr("href");
    var event_id = string.slice(string.length - 8, string.length);
    $(this).append(
      '<div class="mdc-checkbox"> <input type="checkbox" class="mdc-checkbox__native-control" id="' + event_id + '_completed" onclick="change_complete_status(' + event_id + ')"/> <div class="mdc-checkbox__background"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> </div>'
    );
  });
}


function change_complete_status(id) {
  localforage.getItem(String(id)).then(function (value) {
    if (value.complete == 1) {
      var jsonObj = value;
      jsonObj["complete"] = 0;
      localforage.setItem(String(id), jsonObj);
    } else if (value.complete == 0) {
      var jsonObj = value;
      jsonObj["complete"] = 1;
      localforage.setItem(String(id), jsonObj);
    }
  }).catch(function (err) {
    // 当出错时，此处代码运行
    console.log(err);
  });
}

















