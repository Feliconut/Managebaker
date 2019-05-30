//调试用
// (async () => {
//   console.log('upload')
//   var IO = await import('./dataIO.js');
//   IO.dataIO.online.write();
// })()
var RUNTIME_PATH = chrome.runtime.getURL("./");
var tab_Id;
var alarmInfo = {
  periodInMinutes: 30 //10分钟为单位循环执行
};
chrome.alarms.create('dataUploadAlarm', alarmInfo);
//localforage
//第一次安装，根据是否同意协议，引导到不同页面
chrome.runtime.onInstalled.addListener(async function () {
  await import("../lib/localforage.min.js");
  localforage.getItem("config").then(async function (value) {
    if (value.agree == 0) {
      chrome.tabs.create({
        url: RUNTIME_PATH + "modules/index.html"
      });
    } else if (value.domain == "") {
      chrome.tabs.create({
        url: RUNTIME_PATH + "modules/options.html"
      });
    } else {
      var auth = await import('./auth.js');
      auth = auth.default
      await auth.register();
    }
  }).catch(function (err) {
    //值设置不正确则更新
    jsonObj = {
      agree: 0,
      domain: "",
      subdomain: "",
      root: "",
      installDate: new Date()
    };
    localforage.setItem("config", jsonObj);
    chrome.tabs.create({
      url: RUNTIME_PATH + "modules/index.html"
    });

  });
});

//Page listener, send message to managebaker.js for handling and check
chrome.tabs.onActivated.addListener(function (tabId) {
  chrome.tabs.get(tabId.tabId, function (tab) {
    var url = tab.url;
    var patt = new RegExp("managebac");
    if (patt.test(url)) {
      tab_Id = tabId.tabId;
    }
  });
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  a = await import('../doc_handler/prototypes.js');
  pageType = a.pageType;

  var url = tab.url;
  var patt = new RegExp("managebac");
  if (patt.test(url)) {
    tab_Id = tabId;
    //判断tab的标题是否有竖线， MB domcontent 从 url 到title
    if (tab.status == "complete" && tab.title.indexOf("|") != -1) {
      //所有的代码从这里开始，到这里页面才完成加载。

      var messageContent = {
        url: url,
        purpose: 'pageUpdate'
      };

      console.log('tabid:' + tab_Id);

      // var patt1 = new RegExp("student/?$"); //dashboard
      // var patt2 = new RegExp("student/classes/[0-9]+/assignments/?$"); //assignments
      // var patt3 = new RegExp("student/classes/[0-9]+/assignments/[0-9]+/?$");
      // var patt4 = new RegExp("student/ib/events/[0-9]+");



      // if (patt1.test(url)) {
      //   messageContent.type = pageType.dashboard;
      // } else if (patt2.test(url)) {
      //   messageContent.type = pageType.assignmentList;
      // } else if (patt3.test(url)) {
      //   messageContent.type = pageType.assignmentSingle;

      // } else if (patt4.test(url)) {
      //   messageContent.type = pageType.ibEventSingle;
      // } else {
      //   messageContent.type = pageType.others;
      // }

      chrome.tabs.sendMessage(tab_Id, messageContent);
    }
  }
});

//Receives command and control the LocalStorage
chrome.runtime.onMessage.addListener(function storageManager(request, sender, sendResponse) {
  (async function () {
    eventHandler = await import("./eventHandler.js");

    eventHandler = eventHandler.default;

    // console.log(request);
    /*
     * This part is used for oauth TEST only
     *
     */


    switch (request.method) {

      //grab info of event form DB and 
      case "checkboxUpdate": {
        // sendResponse('response')

        var remain_events = request.event_set;

        for (var loadStage = 0; loadStage < 3; loadStage++) {
          switch (loadStage) {
            case 1: {

              await eventHandler.run(eventHandler.mode.FETCH_ALL);
              await sleep(200);
              console.log('fix 1 finish')
              break;
            }
            case 2: {
              await eventHandler.run(eventHandler.mode.FETCH_ALL);
              await sleep(200);
              console.log('fix 2 finish');
              break;
            }
          }

          var remain_events_copy = [...remain_events];
          for (let i = 0; i < remain_events_copy.length; i++) {
            const thisId = remain_events_copy[i];


            // var addData = thisEvent.hasOwnProperty('additionData') ? thisEvent.additionData : {}
            //console.log(thisId)
            var value = await eventHandler.get(thisId);
            // console.log([thisId, value])
            if (value == null) {
              console.log(thisId + ' not found');
              // break;
              // if (remain_events.indexOf(thisId) == -1) {
              //   remain_events.push(thisId);
              // }

            } else {

              remain_events.splice(remain_events.indexOf(thisId), 1);
              chrome.tabs.sendMessage(sender.tab.id, {
                "event_id": thisId,
                "data": {
                  'checked': value.complete,
                  'success': true
                },
                "type": "set_checkbox_status"
              });
            }
          }
          if (remain_events.length == 0) {
            break;
          }
        }

        if (loadStage > 0) {
          // chrome.runtime.sendMessage({
          //   method: "WTF_IS_THIS",
          // });
          all_score_load();
        }

        remain_events.forEach(eventId => {
          console.log('failure' + eventId)
          chrome.tabs.sendMessage(sender.tab.id, {
            "event_id": eventId,
            "data": {
              'checked': false,
              'success': false
            },
            "type": "set_checkbox_status"
          });

        })
        break;
      }

      //toggle COMPLETE attribute of event in database
      case "change_complete_status": {
        await import("../lib/localforage.min.js");
        id = request.event_id;
        // console.log(request)
        var addData = request.hasOwnProperty('additionData') ? request.additionData : {}
        // console.log(addData)

        var value = await eventHandler.get(id, addData);
        if (value === null) {
          console.log('storageManager - change_complete_state - nullValue');
          break;
        }

        value.complete = !value.complete;
        localforage.setItem(id, value);

        break;
      }

      case "taskScoreUpload": {
        taskScoreUpload(request);
        break;
      }

      case "assignment:query_calc_method": {
        var class_list = await eventHandler.get(eventHandler.local.classes);

        //console.log('classlist:' +JSON.stringify(class_list));
        var return_method;
        class_list.forEach(singleClass => {
          if (singleClass.id == request.content) {
            return_method = singleClass.method;
          }
        });
        // console.log('got class id: ' + request.content + ' Calc method: ' + return_method);
        sendResponse(return_method);
        break;

      }


      case "assignment:get_calc_result": {


        await import("../lib/localforage.min.js");
        var classId = request.content.classId;
        var categories = request.content.categories;
        var list = [];
        var year = request.content.range == 'year';
        var start = new Date();
        var first_href = request.content.first_href;

        categories.forEach(item => {
          item.total.get = 0;
          item.total.full = 0;
          item.total.percentage = 0;
          item.count = 0;
        })



        // console.log(first_name + 'first name');
        await localforage.iterate(function (value, key, iterationNumber) {
          if (value.url == first_href) {
            // console.log(value)
            start = new Date(value.start);

          }
        });

        var y = start.getFullYear();
        var m = start.getMonth() + 1;
        //var d = start.getDate();

        const sem_split = 1;

        var startDate;
        var endDate;

        if (year) {
          if (m < 9) {
            startDate = new Date(y - 1, 8, 0);
            endDate = new Date(y, 8, 0);
          } else {
            startDate = new Date(y, 8, 0);
            endDate = new Date(y + 1, 8, 0);
          }
        } else {
          if (m < sem_split + 1) {
            startDate = new Date(y - 1, 8, 0);
            endDate = new Date(y, sem_split, 0);
          } else if (m < 9) {
            startDate = new Date(y, sem_split, 0);
            endDate = new Date(y, 8, 0);

          } else {
            startDate = new Date(y, 8, 0);
            endDate = new Date(y + 1, sem_split, 0);

          }
        }

        // console.log([startDate, endDate]);

        await localforage.iterate(function (value, key, iterationNumber) {
          if (value.classId == classId) {
            if (value.start > startDate && value.start < endDate) {
              // console.log(value);
              list.push(value);
            }
          }
        });

        // console.log(list)
        // console.log(categories)
        for (var i = 0; i < list.length; i += 1) {
          var ass = list[i];
          // calc for each assignment
          if (ass.score.total > 0) {
            // console.log('enter loop')
            // console.log(ass)
            // calculate for each category
            for (var j = 0; j < categories.length; j += 1) {
              var cat = categories[j];
              if (cat.title === ass.category) {
                cat.count += 1;
                cat.total.percentage += ass.score.get / ass.score.total;
                cat.total.full += ass.score.total;
                cat.total.get += ass.score.get;
              }
            }
          }
        }
        for (var j = 0; j < categories.length; j += 1) {
          var cat = categories[j];
          cat.final = [
            cat.total.percentage / cat.count, // percentage
            cat.total.get / cat.total.full, // percentage with point
            cat.total.percentage / cat.count // absolute calculation for each category
          ];
        }
        console.log(categories);
        sendResponse(categories);
        break;

      }
      case "get_user_config": {
        var auth = await import('./auth.js');
        auth = auth.default
        var user = await auth.userinfo();
        chrome.tabs.sendMessage(sender.tab.id, {
          "user": user,
        });
        break;
      }


      case "createurl": {
        if (request.urltype = "extension") {
          var url = request.url
          senderurl = sender.url;
          chrome.tabs.create({
            url: RUNTIME_PATH + url + "#id=" + senderurl.match('[0-9]{8}')[0]
          });



        }
        break;


      }

      case "WTF_IS_THIS": {
        await all_score_load();
        break;
      }

    }




    return true;

  })()
  return true;
});

chrome.alarms.onAlarm.addListener(async () => {
  // eventHandler = await import("./eventHandler.js")
  // eventHandler = eventHandler.default;
  // eventHandler.run(eventHandler.mode.ROLLING_UPDATE);
  var IO = await import('./dataIO.js');
  IO.dataIO.online.write();

});

async function all_score_load() {
  console.log('enter WTF');
  var classes_list = await eventHandler.get(eventHandler.local.classes);
  var configValue = await eventHandler.get(eventHandler.local.config);
  //Query All Scores Start Here
  function readAssignmentData(data) {
    var assignments = [];
    $(data).find(".line").each(function () {
      var $this = $(this);
      var get = parseInt($this.find(".label-score")
        .text()
        .split(" / ", 2)[0]);
      var total = parseInt($this.find(".label-score")
        .text()
        .split(" / ", 2)[1]);
      assignments.push({
        id: parseInt($this
          .find("div.details > h4 > a")
          .attr("href")
          .slice(38)),
        score: {
          get,
          total,
          percentage: get / total
        }
      });
    });
    return assignments;
  }
  var returnData = [];
  console.log('start ajax for all classes')
  for (var i in classes_list) {
    const c = classes_list[i];
    var terms = [80690, 80691];
    for (var j in terms) {
      const m = terms[j];
      await $.ajax({
        url: 'https://' + configValue.domain + '/student/classes/' + c.id + "/assignments?term=" + m,
        success: async (data) => {
          // console.log("ajax for class " + c.id + " in term " + m);
          //READ ALL CLASSES FROM HTML
          // console.log(readAssignmentDataThings)
          var readData = readAssignmentData(data);
          readData.forEach(event => {
            // var item = await eventHandler.get(event.id);
            // console.log(event)
            if (event.score.total > 0) {
              // eventHandler.updateData(assignments);
              returnData.push({
                id: event.id,
                get: event.score.get,
                percentage: event.score.percentage,
                total: event.score.total
              });
            }
          });
        }
      });
    }
  }
  // console.log(returnData);
  taskScoreUpload({
    "data": returnData,
    "method": "taskScoreUpload"
  });
}

function taskScoreUpload(request) {
  console.log('taskScoreUpload');
  request.data.forEach(async (event) => {
    var item = await eventHandler.get(event.id);
    item.score.get = event.get;
    item.score.total = event.total;
    // console.log(event)
    // console.log(item);
    await localforage.setItem(String(event.id), item);
  });
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}