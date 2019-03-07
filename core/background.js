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
  await import(RUNTIME_PATH + "lib/localforage.min.js");
  console.log(request);
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
        eventHandler.run(eventHandler.mode.fetchAll);
        break;
      }
    case 'refresh_rollingUpdate':
      {
        eventHandler.run(eventHandler.mode.rollingUpdate);
        break;
      }

  }

});

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
};
eventHandler.generateDates = async function (mode = null) {
  a = await import('../lib/usefulUtil.js');
  a.dateEnhance.init();
  // a.sayHello('dateEnhanced')

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
        endDate.Add(2, "M");
        break;
      }
    default:
      {
        startDate.Add(-1, "M");
        endDate.Add(1, "M");
        console.log('handlerModeException, running default');
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
};

eventHandler.query = async function (dateData, allCallback = async () => {}, singleCallback = async () => {}) {

  await import(RUNTIME_PATH + "lib/localforage.min.js");
  await import(RUNTIME_PATH + "lib/jquery-3.3.1.js");

  console.log('enterEventHandler');
  console.log(dateData);

  config = await eventHandler.get("config");
  if (config === null) {
    throw 'noConfigSet';
  }
  var url = "https://" + config.domain + "/student/events.json";
  var allCalbackParam = [];
  await $.get(
    url,
    dateData,
    async function (result, status) {
        result.forEach(async (event) => {
          if (typeof event.id != "number") {
            return;
          }
          var id = String(event.id);
          var event_data = {
            title: event.title,
            start: event.start,
            url: event.url,
            complete: 0,
            category: event.category,
            classId: '',
            score: {
              get: 0,
              total: 0
            }
          };

          //检查event的类型,写入classId
          var regPat = new RegExp("student/classes/[0-9]+");
          var ibPat = new RegExp("student/ib");

          if (regPat.test(event.url)) {
            event_data.classId = event.url.slice(17, 25);
          } else if (ibPat.test(event.url)) {
            event_data.classId = "ib";
          }

          //get "complete" key and preserve it, overwrite other
          thisValue = await localforage.getItem(id);
          if (thisValue != null) {
            if (thisValue.complete) {
              event_data.complete = thisValue.complete;
            }
          }
          //已存在->重新写入保留complete
          await localforage.setItem(id, event_data);
          allCalbackParam.push({
            id,
            event_data
          });
          await singleCallback(id, event_data);
        });
        return 1;
      },
      "json"
  );
  await allCallback(allCalbackParam);
  console.log('eventHandler.query - finished');
  return 1;
};

eventHandler.run = async function (mode = null, allCallback = () => {}, singleCallback = () => {}) {

  dateData = await this.generateDates(mode);

  await this.query(dateData, allCallback, singleCallback);

  //chrome.alarm 周期性 eventHandler
  alarmInfo = {
    periodInMinutes: 30
  };
  chrome.alarms.create('eventHandler', alarmInfo);
};

chrome.alarms.onAlarm.addListener(() => {
  eventHandler.run(eventHandler.mode.rollingUpdate);
});


//读取数据的时候如果发现不存在,那么执行修复步骤后再次尝试。达到递归限制后返回模板。
eventHandler.get = async function (id, type = 'event', recur = 0) {
  await import(RUNTIME_PATH + "lib/localforage.min.js");

  if (recur) {
    console.log('enter recur ' + recur);
  }

  if (id == "config") {
    type = "config";
  }

  fetchedValue = await localforage.getItem(id);

  console.log('eventHander.get ->' + id);
  
  if (fetchedValue != null) {
    return fetchedValue;

    //if still recurring then:
    //auto-fix strategy
  } else if (recur < 3) {
    console.log('try autofix in recur ' + recur);
    switch (type) {
      case 'event':
        {
          await eventHandler.run(eventHandler.mode.rollingUpdate);
          break;
        }
      case 'config':
        {
          chrome.tabs.create({
            url: RUNTIME_PATH + "modules/options.html"
          });
          //await 弹出设置，挂起直到设置完成 (todo)
          break;
        }
    }
    recurValue = await eventHandler.get(id, type, recur + 1);

    //send back the result
    if (recurValue != null) {
      return recurValue;
    } else {
      return null;
    }

    //if no more recur then setup default template
    //template will be overwritten by eventHandler.query()
  } else {

    var template = {};

    switch (type) {
      case 'event':
        {
          template = {
            temp: 1,
            title: '',
            start: null,
            url: null,
            complete: 0,
            category: '',
            classId: '',
            score: {
              get: 0,
              total: 0
            }
          };
          break;
        }
      case 'config':
        {
          template = {
            agree: 0,
            domain: "0",
            subdomain: "",
            root: ""
          };
          break;
        }


    }
    console.log(id + ' not found, set template instead');
    await localforage.setItem(id, template);
    return template;
  }
};