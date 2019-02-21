//第一次安装
chrome.runtime.onInstalled.addListener(function () {
  var action_url = chrome.runtime.getURL("lib") + "/1st_run/index.html";
  chrome.tabs.create({
    url: action_url
  });
});



chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  switch (request.status) {
    case "on":
      {
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
          var url = tab.url;
          var patt = new RegExp("managebac");
          if (patt.test(url)) {
            //判断tab的标题是否有竖线， MB domcontent 从 url 到title
            if (tab.status == "complete" && tab.title.indexOf("|") != -1) {
              var patt1 = new RegExp("student$"); //dashboard
              var patt2 = new RegExp("student/classes/[0-9]+/assignments"); //assignments
              if (patt1.test(url)) {
                //dashboard
                //send dashboard to managebaker.js
                eventHandler("1");
                console.log("1");
                chrome.tabs.sendMessage(tabId, {
                  type: "dashboard"
                });
              } else if (patt2.test(url)) {
                //assignments
                //send assignment to managebaker.js
                chrome.tabs.sendMessage(tabId, {
                  type: "assignment"
                });
              } else {
                chrome.tabs.sendMessage(tabId, {
                  type: "other"
                });
              }
            }
          }
        });
      }
  }
});



function eventHandler(modeBool) {
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
  var url = "https://qibaodwight.managebac.cn/student/events.json";
  var dateData = {
    start: startDate.Format("yyyy-MM-dd"),
    end: endDate.Format("yyyy-MM-dd")
  };
  try {
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
            complete: "0",
            category: "",
            score: {
              get: 0,
              total: 0
            }
          };
          
              localforage.setItem(String(event.id), event_data).then(function (value) {
                console.log(value);
              });
            
        });
        return 1;
      },
      "json"
    );
  } catch {
    throw "queryError";
  }
}

function get_event_status(event_id) {
  localforage.getItem(event_id).then(function (result) {
    var data = result;
    if (!result) { // 若无数据
      eventHandler("1");
    } else if (data.complete == 1) {
      checkboxid = event_id + '_completed';
      document.getElementById(checkboxid).checked = true;
    }
  });
}