//第一次安装
chrome.runtime.onInstalled.addListener(function () {
  //第一次安装
});

//Active Tab
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    var url = tab.url;
    var patt1 = new RegExp("student");
    var patt2 = new RegExp("assignment");
    if (patt1.test(url)) {
      //in MB
      if (url.lastIndexOf("student") + 9 > url.length) {
        //dashboard
        chrome.tabs.sendMessage(tabId, {
          type: "dashboard"
        });
      }
      if (patt2.test(url)) {
        //assignment
        chrome.tabs.sendMessage(tabId, {
          type: "assignment"
        });
      }
    }
  }
});