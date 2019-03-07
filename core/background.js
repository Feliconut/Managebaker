/*
DESCRIPTION


*/
var RUNTIME_PATH = chrome.runtime.getURL("./");
var tab_Id

//localforage
//第一次安装，根据是否同意协议，引导到不同页面
chrome.runtime.onInstalled.addListener(async function () {
  await import(RUNTIME_PATH + "lib/localforage.min.js")
  localforage.getItem("config").then(function (value) {
    if (value.agree == 0) {
      chrome.tabs.create({
        url: RUNTIME_PATH + "modules/index.html"
      });
    } else if (value.domain == "0") {
      chrome.tabs.create({
        url: RUNTIME_PATH + "modules/options.html"
      });
    }
  }).catch(function (err) {
    //值设置不正确则更新
    jsonObj = {
      agree: 0,
      domain: "0",
      subdomain: "",
      root: ""
    }
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
  })
})

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  a = await import('../doc_handler/prototypes.js')
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
      }

      console.log(tab_Id)

      var patt1 = new RegExp("student/?$"); //dashboard
      var patt2 = new RegExp("student/classes/[0-9]+/assignments"); //assignments
      var patt3 = new RegExp("student/classes/[0-9]+/assignments/[0-9]+");


      if (patt1.test(url)) {
        messageContent.type = pageType.dashboard
      } else if (patt2.test(url)) {
        if (patt3.test(url)) {
          messageContent.type = pageType.assignmentSingle
        } else {
          messageContent.type = pageType.assignmentList
        }
      } else {
        messageContent.type = pageType.others

      }
      chrome.tabs.sendMessage(tab_Id, messageContent);

    }
  }
});

//Receives command and control the LocalStorage
chrome.runtime.onMessage.addListener(async function storageManager(request, sender, callback) {
  await import(RUNTIME_PATH + "lib/localforage.min.js")
  console.log(request)
  switch (request.method) {
    case "get":
      {
        var event_completed = [];
        var event = request.event_id;
        var length = event.length;
        for (var i = 0; i < length; i++) {
          (function (i) {
            var id = request.event_id[i];
            localforage.getItem(id).then(function (value) {
              if (value.complete == 1) {
                event_completed.push(id);
              }
              var end = length - 1;
              if (i == end) {
                chrome.tabs.sendMessage(sender.tab.id, {
                  "event_id": event_completed,
                  "type": "set_complete"
                });
              }
            })
          })(i);
        }
        break;
      }
    case "change_complete_status":
      {
        id = request.event_id
        localforage.getItem(id).then(function (value) {
          var jsonObj;
          console.log(value)
          if (value.complete == 1) {
            jsonObj = value;
            jsonObj.complete = 0;
            localforage.setItem(id, jsonObj);
          } else if (value.complete == 0) {
            jsonObj = value;
            jsonObj.complete = 1;
            localforage.setItem(id, jsonObj);
          }
        }).catch(function (err) {
          console.log(err)
        })

        break;
      }
    case 'refresh_fetchAll':
      {
        eventHandler.run(eventHandler.mode.fetchAll)
        break;
      }
    case 'refresh_rollingUpdate':
      {
        eventHandler.run(eventHandler.mode.rollingUpdate)
        break;
      }

  }

})

// Event Handler Object
/*/*
===INTERFACE===
eventHandler.run(#<eventHandler.mode>mode, #<func>allCallback, #<func>singleCallback)

#mode:
  -> eventHandler.mode.fetchAll
  -> eventHandler.mode.foolingUpdate

  #allCallback:
    function()

  #singleCallback:
    function(localForageKey, value)
  
  */


const eventHandler = {};
eventHandler.mode = {
  fetchAll: Math.random(),
  rollingUpdate: Math.random()
}
eventHandler.generateDates = async function (mode = null) {
  a = await import('../lib/usefulUtil.js')
  a.dateEnhance.init()
  a.sayHello('dateEnhanced')

  //Code begin here
  var startDate = new Date();
  var endDate = new Date();

  switch (mode) {
    case this.mode.fetchAll:
      {
        startDate.Add(-1, "y");
        endDate.Add(1, "y");
        break;
      }
    case this.mode.rollingUpdate:
      {
        startDate.Add(-1, "M");
        endDate.Add(1, "M");
        break;
      }
    default:
      {
        startDate.Add(-1, "M");
        endDate.Add(1, "M");
        console.log('handlerModeException, running default')
        break;

      }
  }
  endDate.Add(-1, "d");

  var dateData = {
    start: startDate.Format("yyyy-MM-dd"),
    end: endDate.Format("yyyy-MM-dd")
    // start: "2018-01-01",
    // end: "2020-01-01"
  };

  return dateData;
}

eventHandler.query = function (dateData, allCallback = () => {}, singleCallback = () => {}) {
  Promise.all([
    import(RUNTIME_PATH + "lib/localforage.min.js"),
    import(RUNTIME_PATH + "lib/jquery-3.3.1.js")
  ]).then(() => {
    console.log('enterEventHandler')
    console.log(dateData)
    localforage.getItem("config").then(function (value) {
      var url = "https://" + value.domain + "/student/events.json";
      var allCalbackParam = []
      $.get(
        url,
        dateData,
        function (result, status) {
          result.forEach(event => {
            if (typeof event.id != "number") {
              return;
            }
            var id = String(event.id);
            var event_data = {
              title: event.title,
              start: event.start,
              url: event.url,
              complete: 0,
              category: "",
              score: {
                get: 0,
                total: 0
              }
            }
            localforage.getItem(id).then(function (value) {
              // console.log(value)
              if (value.complete === undefined) {
                throw "undefinedValue"
              }
              event_data.complete = value.complete
              //已存在->重新写入保留complete
              localforage.setItem(id, event_data).then(() => {
                allCalbackParam.push({
                  id,
                  event_data
                })
                singleCallback(id, event_data)
              });

            }).catch(function (err) {
              localforage.setItem(id, event_data).then(() => {
                allCalbackParam.push({
                  id,
                  event_data
                })
                singleCallback(id, event_data)
              });
              //不存在或值设置错误->重写覆盖
            })


            return 1;
          })
        },
        "json"
      ).then(() => {
        allCallback(allCalbackParam)
        console.log('async okk!')
      });
    })
  })
}

eventHandler.run = async function (mode = null, allCallback = () => {}, singleCallback = () => {}) {
  dateData = await this.generateDates(mode)

  await this.query(dateData, allCallback, singleCallback)

  //chrome.alarm 周期性 eventHandler
  alarmInfo = {
    periodInMinutes: 30
  }
  chrome.alarms.create('eventHandler', alarmInfo)
}


chrome.alarms.onAlarm.addListener(() => {
  eventHandler.run(eventHandler.mode.rollingUpdate)
})