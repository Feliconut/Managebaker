Date.prototype.Add = function (number, interval = "d") {
  if (typeof number != "number") {
    throw "wrongType_number";
  }
  switch (interval) {
    case "y":
      {
        this.setFullYear(this.getFullYear() + number);
        break;
      }
    case "q":
      {
        this.setMonth(this.getMonth() + number * 3);
        break;
      }
    case "M":
      {
        this.setMonth(this.getMonth() + number);
        break;
      }
    case "w":
      {
        this.setDate(this.getDate() + number * 7);
        break;
      }
    case "d":
      {
        this.setDate(this.getDate() + number);
        break;
      }
    case "h":
      {
        this.setHours(this.getHours() + number);
        break;
      }
    case "m":
      {
        this.setMinutes(this.getMinutes() + number);
        break;
      }
    case "s":
      {
        this.setSeconds(this.getSeconds() + number);
        break;
      }
    default:
      {
        throw "invalidInterval";
      }
  }
  return this;
};

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

document.getElementById("setting_icon").addEventListener("click", function () {
  chrome.runtime.openOptionsPage()
});

/*
document.getElementById("bug_report").addEventListener("click", function () {
  alert("bug");
});
*/

chrome.extension.getBackgroundPage();

async function init() {
  var config = await localforage.getItem("config");
  var domain = config.domain;
  var list = new Array;
  classes = await localforage.getItem("classes");
  await localforage.iterate(function (value, key, iterationNumber) {
    if (value.complete == 0) {
      value.key = key;
      list.push(value)
    }
  })
  $("#loading").text("");
  var list_bydate = list.sort(function (a, b) {
    return b['start'] < a['start'] ? 1 : -1
  })
  for (var n in list_bydate) {
    var value = list_bydate[n];
    var due = new Date(value.start);
    var current = new Date();
    var month = due.toDateString().split(" ")[1]
    var date = due.getDate();
    var time = due.Format("yyyy-MM-dd hh:mm");
    var class_color = getclass_color(value.classId);
    var class_abbr = getclass_abbr(value.classId)
    var string_start = '<div class= "line mdc-list-item"><div class="date-badge due"><div class="month">' + month + '</div><div class="day">' + date + '</div></div><div class="details"><h4 class="title"><a href="https://' + domain + '' + value.url + '" target="_blank">' + value.title + '</a> </h4> <div class="label-and-due"> <!--?xml version="1.0" encoding="utf-8"?--><span class="indicator label" style="color: #fff; background: ' + class_color + '">' + class_abbr + '</span> <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events"> <g> <path fill-rule="evenodd" fill="rgb( 255, 255, 255 )" d="M20.500,2.000 C30.717,2.000 39.000,10.283 39.000,20.500 C39.000,30.717 30.717,39.000 20.500,39.000 C10.283,39.000 2.000,30.717 2.000,20.500 C2.000,10.283 10.283,2.000 20.500,2.000 Z"></path> <path fill-rule="evenodd" fill="#CDD4DD" d="M20.000,40.000 C8.972,40.000 -0.000,31.028 -0.000,20.000 C-0.000,8.972 8.972,-0.000 20.000,-0.000 C31.028,-0.000 40.000,8.972 40.000,20.000 C40.000,31.028 31.028,40.000 20.000,40.000 ZM20.000,2.000 C10.350,2.000 2.000,10.350 2.000,20.000 C2.000,29.650 10.350,38.000 20.000,38.000 C29.649,38.000 38.000,29.650 38.000,20.000 C38.000,10.350 29.649,2.000 20.000,2.000 ZM29.000,21.000 C29.000,21.000 20.000,21.000 20.000,21.000 C19.309,21.000 19.000,20.691 19.000,20.000 C19.000,20.000 19.000,8.000 19.000,8.000 C19.000,7.309 19.309,7.000 20.000,7.000 C20.691,7.000 21.000,7.309 21.000,8.000 C21.000,8.000 21.000,19.000 21.000,19.000 C21.000,19.000 29.000,19.000 29.000,19.000 C29.691,19.000 30.000,19.309 30.000,20.000 C30.000,20.691 29.691,21.000 29.000,21.000 Z"></path> </g> </svg> <div class="due regular"'
    var string_end = '>' + time + '</div></div></div><div class="mdc-checkbox"> <input type="checkbox" class="mdc-checkbox__native-control" id="' + value.key + '" /> <div class="mdc-checkbox__background"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> </div>'
    var string_color = 'style="color:red"'
    if (current > due) {
      var string = string_start + string_color + string_end;
    } else {
      var string = string_start + string_end;
    }
    $(".todolist").append(string);
  }
  $(":checkbox").click(function () {
    var id = $(this).attr("id")
    chrome.runtime.sendMessage({
      "event_id": id,
      "method": "change_complete_status"
    });
  })
  googleanalytics();
}
init();

function getclass_color(id) {
  if (id == "ib") {
    return "#478cfe";
  } else {
    for (var n in classes) {
      if (classes[n].id == id) {
        return classes[n].color;
      }
    }
  }
}

function getclass_abbr(id) {
  if (id == "ib") {
    return "IB";
  } else {
    for (var n in classes) {
      if (classes[n].id == id) {
        return classes[n].abbr;
      }
    }
  }
}


//google analytics
async function googleanalytics(){
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-136396047-2']);
_gaq.push(['_trackPageview']);
(function () {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

}