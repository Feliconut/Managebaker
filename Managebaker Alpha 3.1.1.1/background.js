chrome.runtime.onInstalled.addListener(function() {
  //第一次安装
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    var url = tab.url;
    var patt1 = new RegExp("student");
    var patt2 = new RegExp("assignment");
    if (patt1.test(url)) {
      //in MB
      if (url.lastIndexOf("student") + 9 > url.length) {
        //dashboard
        alert("dashboard");
      }
      if (patt2.test(url)) {
        alert("assignment");
        //assignment
      }
    }
  }
});
