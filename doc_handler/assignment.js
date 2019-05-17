//长的文件分离开来为了方便维护toolbox.js
import {
  rgb2hex,
  hex2rgba,
  dateEnhance
} from "../lib/usefulUtil.js"
import '../lib/Chart_min.js'

function init(calculationMethod = 0, classId) {
  const DATA_SOURCE = 'STORAGE';
  var range = 'year';



  var calculationMethodName = ["percentage weight", "percentage weight with point-based averaging", "absolute weights"][calculationMethod];
  dateEnhance.init();

  var mbChart = $(".tab-content.with-charts");
  if (mbChart.length) {
    var categories = readCategoryData();
    // 有图表，说明有成绩
    /***********
     * Initialization
     ***********/
    var chart;
    if (DATA_SOURCE == "HTML") {
      var assignments = readAssignmentData();
      categoryCal();
      chart = generateChartFrame();
    } else if (DATA_SOURCE == "STORAGE") {
      var first_name = JSON.parse($('div.tab-pane.active > div.assignments-progress-chart').attr('data-series'))[0].name;
      chrome.runtime.sendMessage({
        method: "assignment:get_calc_result",
        content: {
          classId,
          categories,
          range,
          first_name

        }
      }, function (response) {
        categories = response;
        chart = generateChartFrame();

        /***********
         * Events
         ***********/
        // click category
        var $cats = $(".table-condensed > tbody tr > td:first-of-type");
        $cats.click(function () {
          var $this = $(this);
          $this.toggleClass("exclude");
          var i = $cats.index($this) + 1; // first is TOTAL AVERAGE bubble
          chart.data.datasets[i].hidden = $this.hasClass("exclude"); // boolean - true if is excluded (after clicked)
          categories[i - 1].hidden = $this.hasClass("exclude"); // i refer to index in dataset
          refreshTotalAvg();
        });
        $(".chart-wrap")
          // 单击图表乱序
          .click(function () {
            randomizeChart();
          })
          // 双击图表排列整齐
          .dblclick(function () {
            alignChart();
          });
        $(".act-hide")
          .click(function () {
            var $act = $(this)
            var $canva = $(".chart-wrap")
            //避免重复点击
            if (!$canva.is(":animated")) {
              $canva.slideToggle("normal",
                //完成动画后执行
                function () {
                  if (status === 1) {}
                  $act.attr("status", ($act.attr("status") === "Hide" ? 'Show' : 'Hide'));
                });
            }
          })
        $(".act-align")
          .click(function () {
            alignChart();
          })

        $('ul.nav-tabs > li:nth-child(1)')
          .click(function () {
            range = 'year'
            doUpdate(1);


            //refresh display text
            $('.rangeDisplay').text("This academic year")
          })
        $('ul.nav-tabs > li:nth-child(2)')
          .click(function () {
            range = 'term'

            doUpdate(2);

            //refresh display text
            $('.rangeDisplay').text("This term")

          })
        $(".self-calc").click(function () {
          
          chrome.runtime.sendMessage({
            method: "createurl",
            url: "modules/manualcalc.html",
            urltype:"extension"
          });
        })
      
        //初始状态为关闭
        $(".chart-wrap").slideToggle(0);
        $(".act-hide").attr("status", "Show")

        function doUpdate(n) {

          var first_name = JSON.parse($('div.tab-pane:nth-child(' + n + ') > div.assignments-progress-chart').attr('data-series'))[0].name;


          chrome.runtime.sendMessage({
            method: "assignment:get_calc_result",
            content: {
              classId,
              categories,
              range,
              first_name
            }
          }, function (response) {
            categories = response;
            chart.data.datasets = makeChartDatasets();
            chart.update();
          });



        }
      });

    }





    /***********
     * Data Fetch
     ***********/
    function readCategoryData() {
      // 返回值：包含所有category的列表
      var categories = [];
      $(".sidebar .table-condensed tbody tr").each(function () {
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
          total: {
            percentage: 0, // sum of percentage of all assignment
            full: 0, // sum of full marks of all assignments
            get: 0 // grade you got
          },
          hidden: 0
        });
      });
      return categories;
    }

    function readAssignmentData() {
      var assignments = [];
      $(".line").each(function () {
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
      var method = calculationMethod ? calculationMethod : 0
      var scoreSum = 0;
      var weightSum = 0;
      console.log("calculating grade in method " + method)
      for (let index = 0; index < categories.length; index++) {
        var cat = categories[index];
        if (cat.final && !cat.hidden) {
          if (cat.final[calculationMethod]) {
            scoreSum += cat.final[calculationMethod] * cat.weight;
            weightSum += cat.weight;
          }
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
              ass.cat = cat; // reference to category from assignment
              cat.count += 1;
              cat.total.percentage += ass.score.percentage;
              cat.total.full += ass.score.full;
              cat.total.get += ass.score.get;
            }
          }
        }
      }
      for (var j = 0; j < categories.length; j += 1) {
        var cat = categories[j];
        cat.final = [
          cat.total.percentage / cat.count, // percentage
          cat.total.get / cat.total.full, // percentage with point
          cat.total.percentage / cat.count // absolute calculation for each category
        ];
      }
      return assignments;
    }
    /***********
     * Chart Operation
     ***********/
    function refreshTotalAvg() {
      chart.data.datasets[categories.length].data[0].score = totalAverageCal();
      chart.update();
      return 1;
    }

    function makeChartDatasets() {
      //Add all CATEGORIES bubble
      var datasets = [];
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        var newDataSet = {
          backgroundColor: hex2rgba(cat.color, 0.5),
          borderColor: cat.color,
          data: [{
            x: Math.random() + i * 2,
            y: Math.random(),
            r: Math.log2(cat.weight + 2) * 10,
            score: cat.total.full ? cat.final[calculationMethod] : NaN
          }],
          label: cat.title,
          hidden: cat.hidden
        };
        datasets.push(newDataSet);
      }
      // Add TOTAL AVERAGE bubble
      // Add as first
      datasets.unshift({
        backgroundColor: "#4b8ffa",
        borderColor: "#4b8ffa",
        data: [{
          x: Math.random() - 2,
          y: Math.random(),
          r: Math.log2(100) * 10,
          score: totalAverageCal()
        }],
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
      chartProto.before(
        // Title & action button
        '<div class="action-bar pull-right no-select" style="margin-top: -18px;font-size: 14px;"><span class="rangeDisplay"></span><span class="methodName"></span><span class="action act-align">Align</span><span class="self-calc" style="margin-right:-10px;text-decoration:none"> <svg style="height:30px;margin-bottom:-10px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" ><path fill="currentColor" d="M400 0H48C22.4 0 0 22.4 0 48v416c0 25.6 22.4 48 48 48h352c25.6 0 48-22.4 48-48V48c0-25.6-22.4-48-48-48zm0 464H48V208h352v256zm0-304H48V48h352v112zM108.8 320h38.4c6.4 0 12.8-6.4 12.8-12.8v-38.4c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v38.4c0 6.4 6.4 12.8 12.8 12.8zm192 96h38.4c6.4 0 12.8-6.4 12.8-12.8V268.8c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zm-192 0h38.4c6.4 0 12.8-6.4 12.8-12.8v-38.4c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v38.4c0 6.4 6.4 12.8 12.8 12.8zm96-96h38.4c6.4 0 12.8-6.4 12.8-12.8v-38.4c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v38.4c0 6.4 6.4 12.8 12.8 12.8zm0 96h38.4c6.4 0 12.8-6.4 12.8-12.8v-38.4c0-6.4-6.4-12.8-12.8-12.8h-38.4c-6.4 0-12.8 6.4-12.8 12.8v38.4c0 6.4 6.4 12.8 12.8 12.8z"></path></svg></span><span class="action act-hide"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" style="margin-bottom:-18px"><path fill="none" d="M0 0h24v24H0z"/><circle cx="7.2" cy="14.4" r="3.2" fill="#00a650"/><circle cx="14.8" cy="18" r="2" fill="#fff100"/><circle cx="15.2" cy="8.8" r="4.8" fill="#f7941d"/></svg></span></div><h3>Grade Chart</h3>'
      );
      $('.rangeDisplay').text("This academic year").attr("style", "cursor: default;-webkit-text-fill-color: #6c6c6c;")
      $('.methodName').text("Method: " + calculationMethodName).attr("style", "cursor: default;-webkit-text-fill-color: #6c6c6c;")
      chartProto.append(
        '<div class="chart-wrap" style="height: 200px;"><canvas id="score-result-chart"></canvas></div>'
      ); //这里的200px是一个魔性的bug fix
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
            yAxes: [{
              display: false
            }],
            xAxes: [{
              display: false
            }]
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data.datasets[tooltipItem[0].datasetIndex].label;
              },
              label: function (tooltipItem, data) {
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

function run() {
  var currentURL = document.location.href;
  var classId = currentURL.match('[0-9]{8}')[0];
  chrome.runtime.sendMessage({
    method: "assignment:query_calc_method",
    content: classId
  }, function (response) {
    init(response, classId);
  });
}




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

/*
 * Grade Calculation Mathod
 * https://help.managebac.com/support?lesson=608426&manual_id=1970
 *
 * 0: Use Percentage Weight
 * 1: Use Percentage weights with Points-based averaging
 * 2: Use Absolute weights
 */
export default run;