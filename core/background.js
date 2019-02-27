/*
DESCRIPTION


*/
var RUNTIME_PATH = chrome.runtime.getURL("./");
var tabId

//localforage
//第一次安装，根据是否同意协议，引导到不同页面
chrome.runtime.onInstalled.addListener(function () {
  import(RUNTIME_PATH + "lib/localforage.min.js").then(() => {
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
  });
  //临时获取event 数据
  /*
  import(RUNTIME_PATH + 'lib/jquery-3.3.1.js').then(() => {
    eventHandler();
  })
  */
});

//Page listener, send message to managebaker.js for handling
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  var url = tab.url;
  var patt = new RegExp("managebac");
  if (patt.test(url)) {
    activeTab = tabId;
    //判断tab的标题是否有竖线， MB domcontent 从 url 到title
    if (tab.status == "complete" && tab.title.indexOf("|") != -1) {
      var patt1 = new RegExp("student/?$"); //dashboard
      var patt2 = new RegExp("student/classes/[0-9]+/assignments"); //assignments
      var patt3 = new RegExp("student/classes/[0-9]+/assignments/[0-9]+");
      if (patt1.test(url)) {
        //dashboard
        //send dashboard to managebaker.js
        //eventHandler("1");
        chrome.tabs.sendMessage(tabId, {
          type: "dashboard"
        });
      } else if (patt2.test(url)) {
        //assignments
        //send assignment to managebaker.js
        if (patt3.test(url)) {
          chrome.tabs.sendMessage(tabId, {
            type: "assignmentSingle"
          });
        } else {
          chrome.tabs.sendMessage(tabId, {
            type: "assignmentList"
          });
        }
      } else {
        chrome.tabs.sendMessage(tabId, {
          type: "other"
        });
      }
    }
  }
});

//Receives command and control the LocalStorage
chrome.runtime.onMessage.addListener(function storageManager(request, sender, callback) {
  import(RUNTIME_PATH + "lib/localforage.min.js").then(() => {
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
                  chrome.tabs.sendMessage(sender.tab.id,{
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
          var event_id = request.event_id;
          localforage.getItem(event_id).then(function (value) {
            var jsonObj;
            if (value.complete == 1) {
              jsonObj = value;
              jsonObj.complete = 0;
              localforage.setItem(event_id, jsonObj);
            } else if (value.complete == 0) {
              jsonObj = value;
              jsonObj.complete = 1;
              localforage.setItem(event_id, jsonObj);
            }
          })
          break;
        }
    }
  })
});

function eventHandler() {
  /*
    var startDate = new Date();
    var endDate = new Date();
    //long query
    if (modeBool == "1") {
      startDate.Add(-1, "y");
      endDate.Add(1, "y");
      //short query
    } else {
      startDate.Add(-1, "M");
      endDate.Add(1, "M");
    }
    endDate.Add(-1, "d");
    */
  var url = "https://qibaodwight.managebac.cn/student/events.json";
  var dateData = {
    /*
    start: startDate.Format("yyyy-MM-dd"),
    end: endDate.Format("yyyy-MM-dd")
    */
    start: "2018-01-01",
    end: "2020-01-01"
  };

  $.get(
    url,
    dateData,
    function (result, status) {
      result.forEach(event => {
        if (typeof event.id != "number") {
          return;
        }
        var event_data = {
          title: event.title,
          start: event.start,
          url: event.url,
          complete: "1",
          category: "",
          score: {
            get: 0,
            total: 0
          }
        };
        localforage.setItem(String(event.id), event_data).then(function (value) {});
      });
      return 1;
    },
    "json"
  );

}