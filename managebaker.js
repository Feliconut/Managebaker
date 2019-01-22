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
    date1 = new Date();
    date1.setFullYear(2018, 11, 1);
    date2 = new Date();
    date2.setFullYear(2019, 2, 1)
   getData((data) => { console.log(data) });
  }
});

// 返回值：包含所有category的列表
function readCategoryData() {
  var categories = [];
  $(".sidebar .table-condensed tbody tr").each(function() {
    var $this = $(this);
    categories.push({
      title: $this.children().first().text(),
      weight: parseInt($this.children().last().text()) / 100,
    })
  });
  return categories;
}

// 返回值：包含所有作业的Object
function readAssignmentData() {
  var assignments = {};
  $(".line").each(function() {
    var $this = $(this);

    // id
    var assignment_id = +$this.find(".title a").prop("href").split("/").pop();  // int

    // date
    var date_badge = $this.find(".date-badge");
    var month = date_badge.find(".month").text().toLowerCase();
    var date = date_badge.find(".date").text().toLowerCase();
    var monthNum = "janfebmaraprmayjunjulaugsepoctnovdec".indexOf(month.toLowerCase()) / 3;
    var due = new Date();
    due.setDate(date);
    due.setMonth(monthNum);

    // title
    var title = $this.find(".title").text().trim();

    // whether is summative?
    var isSummative = $this.find(".label-summative").length !== 0;

    // score - [得分, 总分]
    var scoreElem = $this.find(".label-score");
    var score;
    var point;
    var calc;
    if (scoreElem.length !== 0) {
      var [yourScore, fullScore] = scoreElem.text().split("/").map(function(str) {
        return +str; // 字符串转换为数字
      });
      score = {
        get: yourScore,
        full: fullScore
      }
      calc = {
        percentage: yourScore / fullScore,
        activate: isSummative
      }
      point = +$this.find(".label-points").text();  // 字符串转换为数字
    } else {
      calc = {
        activate: isSummative
      }
    }
    // category
    var category = $this.find(".labels-set > *").last().text();
    assignments[assignment_id] = {
      title,
      due,
      score,
      calc,
      point,
      isSummative,
      category,
    };
  });
  // console.info(assignments);
  return assignments;
}
