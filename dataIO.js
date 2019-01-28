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
            complete: "1",
            category: "",
            class_id: JSON.stringify(event.url).slice(18, 26),
            score: {
              get: 0,
              total: 0
            }
          };
          localforage.getItem(String(event.id)).then(function (result) {
            if (!result) {
              console.log(event.id);
              localforage.setItem(String(event.id), event_data).then(function (value) {
                console.log(value);
              });
            }
          });

          /*
     
*/


        });
        return 1;
      },
      "json"
    );
  } catch {
    throw "queryError";
  }

}

//本地存储（读写）
//using jQuery
//source1: event.json

//进行数据刷新的方式。dataHandler会自动完成所有的步骤。接下来的更新中它将能够自我维持和动态更新数据。
/*
class dataHandler {
  constructor() {
    console.log('data Handler Initiated')
    this.autoRefresh()
  }

  autoRefresh() {
    console.log('running autoRefresh')
    this.refresh([0, 1, 2, 3, 4, 5])

  }
  dbUpdate(data) {
    data.forEach((event) => {
      if (typeof event.id != 'number') { return }
      var event_data = {
        title: event.title,
        start: event.start,
        complete: "",
        class_id: JSON.stringify(event.url).slice(18, 26)
      }

      localforage.setItem(String(event.id), event_data);

    });
    console.log('updated ' + data.length + ' events')
  }

  refresh(refreshArray) {
    if (typeof refreshArray.__proto__.indexOf != 'function') { throw arrayInvalid }
    //    if (typeof queryArray)

        整合request范围使更加高效。算法可能反而造成浪费。

        refreshArray.sort((a, b) => a - b);
        var queryPair = [refreshArray[0], refreshArray[1]]
        var queryArray = []
        for (let n = 2; n < refreshArray.length; n++) {
          const toCompare = refreshArray[n];
          if (toCompare == queryPair[1] + 1) {
            queryPair[1] = toCompare
          } else {
            queryArray.push(queryPair)
            queryPair[0] = toCompare
            queryPair[1] = toCompare
          }

        }

    var queryArray = refreshArray
    console.log(queryArray)
    queryArray.forEach(m => {
      //console.log(m)
      this.getData((data) => {
        //console.log(data)
        this.dbUpdate(data);
      }, this._timeSect(m), this._timeSect(m + 1))
    });
  }
  getData(callback, startDate = (new Date).Add(-1, 'M'), endDate = startDate.Add(1, 'M')) {
    if (typeof startDate.getMonth === "function" && typeof endDate.getMonth === "function") {
      endDate.Add(-1, 'd')
      var url = "https://qibaodwight.managebac.cn/student/events.json";
      var data = {
        "start": startDate.Format("yyyy-MM-dd"),
        "end": endDate.Format("yyyy-MM-dd")
      }
      try {
        $.get(
          url, data,
          function (result, status) {
            //alert(status)
            callback(result)
            return 1
          },
          "json"
        );

      } catch {
        throw "queryError";
      }
    } else {
      throw "dateInvalid";
    }
  }

  _timeSect(num) {
    //divide one month in 3 (each 10 days)
    var baseTime = new Date(2019, 0, 1)
    //console.log('timesect: ' + baseTime + 'day: ' + num)
    baseTime.Add(num, 'w')
    return baseTime
  }
  _sensitivity(diff) {
    return diff == 0 ? 1 : 1 / Math.abs(diff)
  }
}

dataHandler = new dataHandler()
*/