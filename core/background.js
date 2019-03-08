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
      root: ""
    };
    localforage.setItem("config", jsonObj);
    chrome.tabs.create({
      url: RUNTIME_PATH + "modules/index.html"
    });

  });
  //临时获取event 数据
  /*
  import(RUNTIME_PATH + 'lib/jquery-3.3.1.js').then(() => {
    eventHandler();
  })
  */
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
        type: undefined,
        purpose: 'pageType'
      };

      console.log(tab_Id);

      var patt1 = new RegExp("student/?$"); //dashboard
      var patt2 = new RegExp("student/classes/[0-9]+/assignments"); //assignments
      var patt3 = new RegExp("student/classes/[0-9]+/assignments/[0-9]+");
      var patt4 = new RegExp("student/ib/events/[0-9]+");



      if (patt1.test(url)) {
        messageContent.type = pageType.dashboard;
      } else if (patt2.test(url)) {
        if (patt3.test(url)) {
          messageContent.type = pageType.assignmentSingle;
        } else {
          messageContent.type = pageType.assignmentList;
        }
      } else if (patt4.test(url)) {
        messageContent.type = pageType.ibEventSingle;
      } else {
        messageContent.type = pageType.others;

      }
      chrome.tabs.sendMessage(tab_Id, messageContent);

    }
  }
});

//Receives command and control the LocalStorage
chrome.runtime.onMessage.addListener(async function storageManager(request, sender, callback) {
  await import("../lib/localforage.min.js");
  eventHandler = await import("./eventHandler.js")
  eventHandler = eventHandler.default
  console.log(request);
  console.log(eventHandler);

  switch (request.method) {
    case "get":
      {
        var event_completed = [];
        var event = request.event_id;

        for (var i = 0; i < event.length; i++) {
          thisId = request.event_id[i];
          // console.log([thisId, 'getting'])
          value = await eventHandler.get(thisId);
          // console.log([thisId, value])
          if (value == null) {
            console.log('storageManager - get - nullValue');
            break;
          }

          if (value.complete == 1) {
            event_completed.push(thisId);
          }
        }

        chrome.tabs.sendMessage(sender.tab.id, {
          "event_id": event_completed,
          "type": "set_complete"
        });

        break;
      }

    case "change_complete_status":
      {
        id = request.event_id;

        value = await eventHandler.get(id);
        if (value === null) {
          console.log('storageManager - change_complete_state - nullValue');
          break;
        }

        if (value.complete == 1) {
          value.complete = 0;
          localforage.setItem(id, value);
        } else if (value.complete == 0) {
          value.complete = 1;
          localforage.setItem(id, value);
        }


        break;
      }
    case 'refresh_fetchAll':
      {
        eventHandler.run(eventHandler.mode.FETCH_ALL);
        break;
      }
    case 'refresh_rollingUpdate':
      {
        eventHandler.run(eventHandler.mode.ROLLING_UPDATE);
        break;
      }

  }

});

chrome.alarms.onAlarm.addListener(async () => {
  eventHandler = await import("./eventHandler.js")
  eventHandler = eventHandler.default

  eventHandler.run(eventHandler.mode.ROLLING_UPDATE);
});