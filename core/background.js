/*
DESCRIPTION
*/
var RUNTIME_PATH = chrome.runtime.getURL("./");
var tab_Id;
//localforage
//第一次安装，根据是否同意协议，引导到不同页面
chrome.runtime.onInstalled.addListener(async function () {
  await import("../lib/localforage.min.js");
  localforage.getItem("config").then(function (value) {
    if (value.agree == 0) {
      chrome.tabs.create({
        url: RUNTIME_PATH + "modules/index.html"
      });
    } else if (value.domain == "") {
      chrome.tabs.create({
        url: RUNTIME_PATH + "modules/options.html"
      });
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
    eventHandler = await import("./eventHandler.js")

    eventHandler = eventHandler.default;

    // console.log(request);
    /*
     * This part is used for oauth TEST only
     *
     */
    //auth = await import('./auth.js')
    //auth = auth.default
    //auth.register()
    //var login = await auth.login()
    //console.log(login)

    switch (request.method) {

      //grab info of event form DB and 
      case "checkboxUpdate":
        {
          // sendResponse('response')

          var loadStage = 0
          var remain_events = request.event_set


          while (loadStage < 3 && remain_events.length) {
            console.log('loadStage' + loadStage);
            switch (loadStage) {
              case 1:
                {

                  await eventHandler.run(eventHandler.mode.ROLLING_UPDATE);
                  console.log('fix 1 finish')
                  break;
                }
              case 2:
                {
                  await eventHandler.run(eventHandler.mode.FETCH_ALL);
                  console.log('fix 2 finish');
                  break;
                }
            }
            loadStage++;


            remain_events.forEach(async thisId => {

              // var addData = thisEvent.hasOwnProperty('additionData') ? thisEvent.additionData : {}
              //console.log(thisId)
              value = await eventHandler.get(thisId);
              // console.log([thisId, value])
              if (value == null) {
                // console.log('storageManager - get - nullValue');
                // break;
                if (remain_events.indexOf(thisId) == -1) {
                  remain_events.push(thisId);
                }
                return;
              } else {
                remain_events.pop(remain_events.indexOf(thisId))

              }
              //console.log('eventid:' + thisId + 'complete:' + value.complete)
              chrome.tabs.sendMessage(sender.tab.id, {
                "event_id": thisId,
                "data": {
                  'checked': value.complete,
                  'success': true
                },
                "type": "set_checkbox_status"
              });

            });


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
      case "change_complete_status":
        {
          await import("../lib/localforage.min.js");
          id = request.event_id;
          // console.log(request)
          var addData = request.hasOwnProperty('additionData') ? request.additionData : {}
          // console.log(addData)

          value = await eventHandler.get(id, addData);
          if (value === null) {
            console.log('storageManager - change_complete_state - nullValue');
            break;
          }

          value.complete = !value.complete;
          localforage.setItem(id, value);

          break;
        }

      case "assignment:query_calc_method":
        {
          var class_list = await eventHandler.get(eventHandler.local.classes);
          
          //console.log('classlist:' +JSON.stringify(class_list));
          var return_method;
          class_list.forEach(singleClass => {
            if (singleClass.id == request.content) {
              return_method = singleClass.method;
            }
          });
          console.log('got class id: '+request.content +' Calc method: ' + return_method);
          sendResponse(return_method)
          break;

        }



    }




    return true;

  })()
  return true;
});

chrome.alarms.onAlarm.addListener(async () => {
  eventHandler = await import("./eventHandler.js")
  eventHandler = eventHandler.default;
  eventHandler.run(eventHandler.mode.ROLLING_UPDATE);
});