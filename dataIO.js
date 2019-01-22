//本地存储（读写）
//using jQuery

//source1: event.json
dataHandler = {
  month: ((m) => {
    d = new Date();
    d.setMonth(d.getMonth() + m);
    return d;
  }),
  autoRefresh



}




function getData(
  f,
  d1 = month(-1),
  d2 = month(1)
) {
  if (typeof d1.getMonth === "function" && typeof d2.getMonth === "function") {
    url =
      "https://qibaodwight.managebac.cn/student/events.json?start=" +
      d1.Format("yyyy-MM-dd") +
      "&end=" +
      d2.Format("yyyy-MM-dd");
    //alert(url);
    try {
      $.get(
        url,
        function (data, status) {
          //alert(status)
          f(data)
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


