//第一次安装
chrome.runtime.onInstalled.addListener(function () {
  var action_url = chrome.runtime.getURL("1st_run") + "/index.html";
  chrome.tabs.create({
    url: action_url
  });
});

//Active Tab
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  //判断tab的标题是否有竖线， MB domcontent 从 url 到title
  if (tab.status == "complete" && tab.title.indexOf("|") != -1) {
    var url = tab.url;
    var patt1 = new RegExp("student$"); //dashboard
    var patt2 = new RegExp("student/classes/[0-9]+/assignments"); //assignments
    if (patt1.test(url)) {
      //dashboard
      //send dashboard to managebaker.js
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
});