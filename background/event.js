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
  var url = "https://" + location.host + "/student/events.json";
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
          localforage.getItem(String(event.id)).then(function (result) {
            if (!result) {
              localforage.setItem(String(event.id), event_data).then(function (value) {
                //console.log(value);
              });
            }
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