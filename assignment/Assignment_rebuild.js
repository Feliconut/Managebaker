/*!
 * Managebaker
 * https://padlet.com/xyliu_felix/Managebaker
 * Version: 3.1.1.1
 *
 * Copyright 2019 Managebaker Contributors
 * Released under the Apache license
 * https://github.com/Feliconut/Managebaker/blob/master/LICENSE
 */

/*
 * Categories[], chart.data.datasets 中的排列顺序与表格相同。
 * 若表格中有n个category
 * index:
 * 0=>1st cat
 * 1=>2nd cat
 * ...
 * n-1=>nth cat
 * n=>TOTAL AVERAGE (in chart)
 */
function assignment() {
  add_assignment_Style();
  var mbChart = $(".assignments-progress-chart");
  if (mbChart.length) {
    // 有图表，说明有成绩
    gradeChart();
  }

  function gradeChart() {
    /***********
     * Initialization
     ***********/
    var categories = readCategoryData();
    var assignments = readAssignmentData();
    categoryCal();

    var chart = generateChartFrame();
    /***********
     * Events
     ***********/
    // click category
    $cats = $(".table-condensed > tbody tr > td:first-of-type");
    $cats.click(function() {
      var $this = $(this);
      $this.toggleClass("exclude");
      var i = $cats.index($this);
      chart.data.datasets[i].hidden = $this.hasClass("exclude"); // boolean - true if is excluded (after clicked)
      categories[i].hidden = $this.hasClass("exclude");
      refreshTotalAvg();
    });
    $(".chart-wrap")
      // 单击图表
      .click(function() {
        randomizeChart();
      })
      // 双击图表
      .dblclick(function() {
        alignChart();
      });
    /***********
     * Data Fetch
     ***********/
    function readCategoryData() {
      // 返回值：包含所有category的列表
      var categories = [];
      $(".sidebar .table-condensed tbody tr").each(function() {
        var $this = $(this);
        categories.push({
          title: $this
            .children()
            .first()
            .text(),
          weight: parseInt(
            $this
              .children()
              .last()
              .text()
          ),
          color: rgb2hex(
            $this
              .children()
              .first()
              .css("color")
          ),
          count: 0,
          total: 0,
          hidden: 0
        });
      });
      return categories;
    }
 
    function readAssignmentData() {
      var assignments = [];
      $(".line").each(function() {
        var $this = $(this);

        var due = new Date();
        var month = $this.find(".month").text().toLowerCase();
        due.setMonth("janfebmaraprmayjunjulaugsepoctnovdec".indexOf(month.toLowerCase()) / 3);
        due.setDate($this.find(".date").text().toLowerCase());

        var get = parseInt($this.find(".label-score")
                                .text()
                                .split(" / ", 2)[0]);
        var full = parseInt($this.find(".label-score")
                                .text()
                                .split(" / ", 2)[1]);
        var isSummative = $this.find(".labels-set > .label:first")
                                .text()
                                .toLowerCase() == "summative";

        assignments.push({
          id: parseInt(
            $this
              .find("div.details > h4 > a")
              .attr("href")
              .slice(38)
          ),
          category: $this.find(".labels-set > .label:last").text(),
          isSummative,
          score: {
            get,
            full,
            percentage: get / full
          },
          due,
          valid: full ? isSummative : false
        });
      });
      return assignments;
    }
    /***********
     * Calculate
     ***********/
    function totalAverageCal() {
      var scoreSum = 0;
      var weightSum = 0;
      for (let index = 0; index < categories.length; index++) {
        cat = categories[index];
        if (cat.final && !cat.hidden) {
          scoreSum += cat.final * cat.weight;
          weightSum += cat.weight;
        }
      }
      return scoreSum / weightSum;
    }

    function categoryCal() {
      for (var i = 0; i < assignments.length; i += 1) {
        var ass = assignments[i];
        // calc for each assignment
        ass.score.percentage = ass.score.get / ass.score.full;
        if (ass.valid) {
          // calculate for each category
          for (var j = 0; j < categories.length; j += 1) {
            var cat = categories[j];
            if (cat.title === ass.category) {
              cat.count += 1;
              cat.total += ass.score.percentage;
            }
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
    function refreshTotalAvg() {
      /*
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        chart.datasets[i].data[0].score = cat.final
      }
      */
      chart.data.datasets[categories.length].data[0].score = totalAverageCal();
      chart.update();
      return 1;
    }

    function makeChartDatasets() {
      //Add all CATEGORIES bubble
      var datasets = [];
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        newDataSet = {
          backgroundColor: hex2rgba(cat.color, 0.5),
          borderColor: cat.color,
          data: [
            {
              x: Math.random() + i * 2,
              y: Math.random(),
              r: Math.log2(cat.weight + 2) * 10,
              score: cat.final
            }
          ],
          label: cat.title,
          hidden: cat.hidden
        };
        //console.log(newDataSet)
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
            score: totalAverageCal()
          }
        ],
        label: "Average Percentage"
      });
      return datasets;
    }

    function generateChartFrame() {
      //insert chart to document
      var chartProto = $('<div class="managbaker-chart"></div>').insertAfter(
        mbChart
      );
      //construction of chart
      chartProto.before('<hr class="divider"></hr>');
      chartProto.append(
        // Title & action button
        '<div class="action-bar pull-right no-select"><span class="action act-hide">Hide</span><span class="action refresh">Refresh Chart</span></div><h3>Grade Chart</h3>'
      );
      chartProto.append(
        '<div class="chart-wrap"><canvas id="score-result-chart"></canvas><div>'
      );
      var scoreChart = chartProto.find('canvas');
      scoreChart[0].height = 200;
      var ctx = scoreChart[0].getContext("2d");
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
              title: function(tooltipItem, data) {
                return data.datasets[tooltipItem[0].datasetIndex].label;
              },
              label: function(tooltipItem, data) {
                var score =
                  data.datasets[tooltipItem.datasetIndex].data[0].score;
                if (isNaN(score)) {
                  score = "No score yet";
                } else {
                  score = (score * 100).toFixed(2).toString() + "%";
                }
                return score;
              }
            }
          }
        }
      };
      //generate chart detail
      var chart = new Chart(ctx, chartDef);
      chart.data.datasets = makeChartDatasets();
      chart.update();
      return chart; // 返回 Chart.js 图表Object
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

    function alignChart() {
      for (var i = 0; i < chart.data.datasets.length; i += 1) {
        var dataset = chart.data.datasets[i];
        dataset.data[0].x = i * 2;
        dataset.data[0].y = 0;
      }
      chart.update();
      return chart;
    }
  }
}

function add_assignment_Style() {
  add_general_style();
  $(".line").addClass("mdc-list-item");
  $(".line").each(function () {
    var string = $(this).find("a").attr("href");
    var class_id = string.slice(17, 25);
    var event_id = string.slice(38, 50);
    console.log(class_id, event_id);
    $(this).append(
      '<div class="mdc-checkbox"> <input type="checkbox" class="mdc-checkbox__native-control" id="' + event_id + '_completed"/> <div class="mdc-checkbox__background"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> </div>'
    );
  });

  /*
    document.getElementById("20401611_completed").checked = true;
    
    var type = document.getElementById("20401611_completed");
    if (type.checked) {
      //alert("1")
    }
    */
  //document.getElementById("").disabled=true;
}

/*
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
*/
