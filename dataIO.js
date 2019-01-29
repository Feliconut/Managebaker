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
          //console.log(event)
          var event_data = {
            title: event.title,
            start: event.start,
            complete: 0,
            category: "",
            class_id: JSON.stringify(event.url).slice(18, 26),
            score: {
              get: 0,
              total: 0
            }
          };
          if (modeBool == "1") {
            event_data["complete"] = 1;
            //short query
          }
          localforage.getItem(String(event.id)).then(function (result) {
            if (!result) {
              //console.log(event.id);
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
    if (typeof (result) == undefined) {
      eventHandler();
    } else if (data.complete == 1) {
      checkboxid = event_id + '_completed';
      document.getElementById(checkboxid).checked = true;
    }
  });
}