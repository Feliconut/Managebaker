//第一次安装
chrome.runtime.onInstalled.addListener(function () {
  //第一次安装
});


//Active Tab
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  //判断tab的标题是否有竖线， MB domcontent 从 url 到title
  if (tab.status == "complete" && tab.title.indexOf("|") != -1) {
    var url = tab.url;
    var patt1 = new RegExp("student");
    var patt2 = new RegExp("assignment");
    if (patt1.test(url)) {
      //if in MB
      if (url.lastIndexOf("student") + 9 > url.length) {
        //dashboard
        //send dashboard to content.js
        chrome.tabs.sendMessage(tabId, {
          type: "dashboard"
        });
      }
      if (patt2.test(url)) {
        //assignment
        //send assignment to content.js
        chrome.tabs.sendMessage(tabId, {
          type: "assignment"
        });
      }
    }
  }
});