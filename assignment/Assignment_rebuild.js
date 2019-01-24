/*!
 * Managebaker
 * https://padlet.com/xyliu_felix/Managebaker
 * Version: 3.1.1.1
 *
 * Copyright 2019 Managebaker Contributors
 * Released under the Apache license
 * https://github.com/Feliconut/Managebaker/blob/master/LICENSE
 */

/*PSEUCODE:

import jQuery.js, chart.js

readAssignmentData()
✓ calculate()
✓ generateChart()

✓ Event category.click:
    ✓ disableCat()
    ✕ calculate() 没有重新加载数据

✓ Event chart.dblclick:
    refreshChart()
  
Event chart.click:
    randomMotion()
*/

/*DATA STRUCTURE:
===TABLE===
ASSIGNMENT_ID | JSON_DATA

===JSON_DATA===
{
  obj score{
    int full
    int get
  }
  Obj calc{
    double percentage
    boolean activate
  }
}
*/

function assignment() {
  /*********** 
 * Initialization
 ***********///     |
  //enter 0 or 1    v
  var useMockData = 0
  var getData = {
    real: function () {
      var categories = readCategoryData();
      var assignments = readAssignmentData();
      return { assignments, categories };
    },
    mock: function () {
      var categories = [
        {
          title: "Literary Analysis",
          weight: 10,
          count: 0,
          total: 0,
          color: "#33C",
        },
        {
          title: "Formative Assessment",
          weight: 10,
          count: 0,
          total: 0,
          color: "#33C",
        },
        {
          title: "Commentary & Reflection on Literary Work",
          weight: 30,
          count: 0,
          total: 0,
          color: "#33C",
        },
        {
          title: "oral",
          weight: 20,
          count: 0,
          total: 0,
          color: "#33C",
        },
        {
          title: "Semester Assessment",
          weight: 30,
          count: 0,
          total: 0,
          color: "#33C",
        }
      ];
      var assignments = [{
        "id": 20517049,
        "title": "IA - Christmas holiday homework",
        "start": "2019-01-02T21:00:00.000+08:00",
        "end": null,
        "allDay": false,
        "description": "\u003cp\u003e\u003cspan data-pwa-id=\"pwa-0CD8DEB11D90ECBE3CB466B7200A6A53\" data-pwa-category=\"\" data-pwa-hint=\"Unknown word: 请完成之前布置的IA，这里老师重新把题目放上去，同时，大家可以根据老师附件的文件来自查一下写的时候是否已经wang老师上课\" data-pwa-suggestions=\"Wang~vinegar~Wong~wink~Wenger\" data-pwa-dictionary-word=\"请完成之前布置的IA，这里老师重新把题目放上去，同时，大家可以根据老师附件的文件来自查一下写的时候是否已经wang老师上课\"\u003e请完成之前布置的IA，这里老师重新把题目放上去，同时，大家可以根据老师附件的文件来自查一下写的时候是否已经按照\u003c/span\u003e\u003cspan data-pwa-id=\"pwa-0CD8DEB11D90ECBE3CB466B7200A6A53\" data-pwa-category=\"\" data-pwa-hint=\"Unknown word: 请完成之前布置的IA，这里老师重新把题目放上去，同时，大家可以根据老师附件的文件来自查一下写的时候是否已经wang老师上课\" data-pwa-suggestions=\"Wang~vinegar~Wong~wink~Wenger\" data-pwa-dictionary-word=\"请完成之前布置的IA，这里老师重新把题目放上去，同时，大家可以根据老师附件的文件来自查一下写的时候是否已经wang老师上课\"\u003e老师上课讲的评分标准去写。\u003c/span\u003e\u003c/p\u003e\u003cp\u003e\u003cspan data-pwa-id=\"pwa-0CD8DEB11D90ECBE3CB466B7200A6A53\" data-pwa-category=\"\" data-pwa-hint=\"Unknown word: 请完成之前布置的IA，这里老师重新把题目放上去，同时，大家可以根据老师附件的文件来自查一下写的时候是否已经wang老师上课\" data-pwa-suggestions=\"Wang~vinegar~Wong~wink~Wenger\" data-pwa-dictionary-word=\"请完成之前布置的IA，这里老师重新把题目放上去，同时，大家可以根据老师附件的文件来自查一下写的时候是否已经wang老师上课\"\u003e作业递交方式：turnitin， 上传word. Class iD 19921566\u0026nbsp; key: qinchenhl2\u003cbr\u003e\u003c/span\u003e\u003c/p\u003e",
        "hint_url": "/student/classes/11014438/events/20517049/hint",
        "editable": false,
        "ia_copy": false,
        "backgroundColor": "#205C00",
        "textColor": "#fff",
        "category": "oral",
        "url": "/student/classes/11014438/assignments/20517049",
        score: {
          get: 9,
          full: 10,
        }
      }, {
        "id": 20517230,
        "title": "圣诞迎新假作业：语言的演变专题研究",
        "start": "2019-01-02T23:00:00.000+08:00",
        "end": null,
        "allDay": false,
        "description": "\u003cp\u003e\u003cspan data-pwa-id=\"pwa-732987D9E625EE12B55FEE4ED7788BAA\" data-pwa-category=\"\" data-pwa-hint=\"Unknown word: 请各组在MB上传ppt及其他相关材料\" data-pwa-suggestions=\"\" data-pwa-dictionary-word=\"请各组在MB上传ppt及其他相关材料\" class=\"pwa-mark-done\"\u003e请各组在DDL之前（Jan 2, 11PM）在MB上传ppt\u003c/span\u003e\u003c/p\u003e\r\n\u003cp\u003ePPT至少包括：标题页（包括组员名字和分工）、每页页眉/页脚、目录页、小结页、参考文献页\u003c/p\u003e\r\n\u003cp\u003e请根据FOA评估标准\u003cstrong\u003e（本次侧重于理论深度，形式上可以不创新）\u003c/strong\u003e\u0026本单元核心主题“文化背景/语境中的语言”，选取有意思的语言现象进行探究，大胆尝试与实践。\u003c/p\u003e\u003cp\u003e每组展示时间：20分钟\u003c/p\u003e\r\n\u003cp\u003e分组表如下，曾灏请和顾泉、宋可仰、欧阳慕风一组。\u003c/p\u003e\r\n\u003cfigure\u003e\u003cimg src=\"/attachments/BAh7CEkiCGdpZAY6BkVUSSIuZ2lkOi8vbWFuYWdlYmFjL0Fzc2V0LzQyMTQ2NTE0P2V4cGlyZXNfaW4GOwBUSSIMcHVycG9zZQY7AFRJIgxkZWZhdWx0BjsAVEkiD2V4cGlyZXNfYXQGOwBUMA==--57b53cac0e058ae2815a69854c8414878aa22243\" data-image=\"BAh7CEkiCGdpZAY6BkVUSSIuZ2lkOi8vbWFuYWdlYmFjL0Fzc2V0LzQyMTQ2NTE0P2V4cGlyZXNfaW4GOwBUSSIMcHVycG9zZQY7AFRJIgxkZWZhdWx0BjsAVEkiD2V4cGlyZXNfYXQGOwBUMA==--57b53cac0e058ae2815a69854c8414878aa22243\"\u003e\u003c/figure\u003e\r\n\u003cfigure\u003e\u003cimg src=\"/attachments/BAh7CEkiCGdpZAY6BkVUSSIuZ2lkOi8vbWFuYWdlYmFjL0Fzc2V0LzQyMTQ2NTE1P2V4cGlyZXNfaW4GOwBUSSIMcHVycG9zZQY7AFRJIgxkZWZhdWx0BjsAVEkiD2V4cGlyZXNfYXQGOwBUMA==--f7d5df2b59898b6045fa6b0938a932077dabad96\" data-image=\"BAh7CEkiCGdpZAY6BkVUSSIuZ2lkOi8vbWFuYWdlYmFjL0Fzc2V0LzQyMTQ2NTE1P2V4cGlyZXNfaW4GOwBUSSIMcHVycG9zZQY7AFRJIgxkZWZhdWx0BjsAVEkiD2V4cGlyZXNfYXQGOwBUMA==--f7d5df2b59898b6045fa6b0938a932077dabad96\"\u003e\u003c/figure\u003e\r\n\u003cp\u003e主题探究及学习成果登记表链接如下\u003c/p\u003e\r\n\u003cp\u003e\u003ca href=\"https://docs.qq.com/sheet/DWG9RZlVPUVF3b1dZ?tdsourcetag=s_macqq_aiomsg\u0026tab=BB08J2\"\u003ehttps://docs.qq.com/sheet/DWG9...\u003c/a\u003e\u003c/p\u003e",
        "hint_url": "/student/classes/11014390/events/20517230/hint",
        "editable": false,
        "ia_copy": false,
        "backgroundColor": "#fff100",
        "textColor": "#000",
        "category": "Semester Assessment",
        "url": "/student/classes/11014390/assignments/20517230",
        score: {
          get: 9,
          full: 10,
        }
      }];
      return { assignments, categories };
    }
  }
  var { assignments, categories } = useMockData ? getData.mock() : getData.real()

  //initialize chart
  var chart = generateChart();

  /*********** 
   * Events
   ***********/
  // click category
  $(".table-condensed").on("click", "tbody tr > td:first-of-type", function () {
    var $this = $(this);
    $this.toggleClass("exclude");
    var catTitle = $(this).text();
    for (var i = 0; i < chart.data.datasets.length; i += 1) {
      var dataset = chart.data.datasets[i];
      if (dataset.label === catTitle) {
        dataset.hidden = $this.hasClass("exclude"); // boolean - true if is excluded (after clicked)
      }
    }
    refreshChart()
  });

  $(".chart-wrap")
    // 单击图表
    .click(function () {
      randomizeChart();
    })
    // 双击图表
    .dblclick(function () {
      refreshChart()
    })
    // 执行一次双击更新
    .dblclick();

  addCheckbox();

  function addCheckbox() {
    $(".line").addClass("mdc-list-item");
    //$(".line").addClass("mdc-ripple-upgraded");
    //防止重复添加checkbox
    if (!$(".line").has("input").length) {
      $("div.line").append(
        '<div class="mdc-checkbox"> <input type="checkbox" checked="checked" class="mdc-checkbox__native-control" id="" /> <div class="mdc-checkbox__background"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> </div>'
      );

    }
  }
  /*********** 
   * Data Fetch
   ***********/
  // 返回值：包含所有category的列表
  function readCategoryData() {
    var categories = [];
    $(".sidebar .table-condensed tbody tr").each(function () {
      var $this = $(this);
      categories.push({
        title: $this.children().first().text(),
        weight: parseInt($this.children().last().text()),
        color: rgb2hex($this.children().first().css("color")), // jQuery获得的css color是rgb格式，转换为hex
        count: 0,
        total: 0,
      })
    });
    return categories;
  }
  function readAssignmentData() {
    return []
  }


  /*********** 
 * Calculate
 ***********/
  function totalAverage() {
    var scoreSum = 0;
    var weightSum = 0;
    for (let index = 0; index < categories.length; index++) {
      cat = categories[index];
      if (cat.final) {
        scoreSum += cat.final * cat.weight;
        weightSum += cat.weight;
      }
    }
    return scoreSum / weightSum;
  }

  function assignmentCal() {
    for (var i = 0; i < assignments.length; i += 1) {
      var ass = assignments[i];
      // calc for each assignment
      ass.score.percentage = ass.score.get / ass.score.full;

      // calculate for each category
      for (var j = 0; j < categories.length; j += 1) {
        var cat = categories[j];

        // TODO 检测是否 valid
        if (ass.score && cat.title === ass.category) {
          cat.count += 1;
          cat.total += ass.score.percentage;
        }
      }
    }
    for (var j = 0; j < categories.length; j += 1) {
      var cat = categories[j];
      cat.final = cat.total / cat.count;
    }
    return assignments;
  }


  /*********** 
 * Chart Operation
 ***********/
  function makeChartDatasets() {
    //Add all CATEGORIES bubble
    var datasets = [];
    for (let cat = 0; cat < categories.length; cat++) {
      newDataSet = {
        backgroundColor: hex2rgba(categories[cat].color, 0.5),
        borderColor: categories[cat].color,
        data: [
          {
            x: Math.random() + cat * 2,
            y: Math.random(),
            r: Math.log2(categories[cat].weight + 2) * 10,
            score: categories[cat].final
          }
        ],
        label: categories[cat].title
      };
      datasets.push(newDataSet);
    }
    //Add TOTAL AVERAGE bubble
    datasets.push({
      backgroundColor: "#4b8ffa",
      borderColor: "#4b8ffa",
      data: [
        {
          x: Math.random() - 2,
          y: Math.random(),
          r: Math.log2(100) * 10,
          score: totalAverage()
        }
      ],
      label: "Average Percentage"
    });
    return datasets;
  }

  function generateChart() {
    var mbChart = $(".assignments-progress-chart");
    if (!mbChart.length) {
      // 没有图表，说明没有成绩
      return;
    }
    //insert chart to document
    var chart = $('<div class="managbaker-chart"></div>').insertAfter(mbChart);
    //construction of chart
    chart.before('<hr class="divider"></hr>');
    chart.append('<h3>Grade Chart</h3>');
    chart.append('<div class="chart-wrap"><canvas id="score-result-chart"></canvas><div>');
    var scoreChart = chart.find('canvas');
    scoreChart[0].height = 200;
    var ctx = scoreChart[0].getContext('2d');

    //Define basic option & TOOLTIP
    var chartDef = {
      type: "bubble",
      // The data for our dataset
      data: {
        datasets: []
      },

      // Configuration options
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 100,
            right: 100,
            top: 50,
            bottom: 50
          }
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              display: false
            }
          ],
          xAxes: [
            {
              display: false
            }
          ]
        },
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data.datasets[tooltipItem[0].datasetIndex].label;
            },
            label: function (tooltipItem, data) {
              var score = data.datasets[tooltipItem.datasetIndex].data[0].score;
              if (isNaN(score)) {
                score = 'No score yet';
              } else {
                score = (score * 100).toFixed(2).toString() + "%";
              }
              return score;
            },
          }
        }
      }
    };
    //generate chart detail
    var thisChart = new Chart(ctx, chartDef);

    return thisChart; // 返回 Chart.js 图表Object
  }

  // reload chart from data
  function refreshChart() {
    // calc
    assignmentCal();

    chart.data.datasets = makeChartDatasets();
    chart.update();
    return chart;
  }

  function randomizeChart() {
    for (var i = 0; i < chart.data.datasets.length; i += 1) {
      var dataset = chart.data.datasets[i];
      dataset.data[0].x = Math.random();
      dataset.data[0].y = Math.random();
    }
    chart.update();
    return chart;
  }
}
