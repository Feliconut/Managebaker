function assignment() {
  //$(".agenda").addClass("mdc-list");
  $(".line").addClass("line");
  $(".line").addClass("mdc-list-item");
  //$(".line").addClass("mdc-ripple-upgraded");
  $("div.line").append(
    ' <div class="mdc-checkbox mdc-list-item__meta mdc-checkbox--upgraded mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" style="--mdc-ripple-fg-size:24px; --mdc-ripple-fg-scale:1.66667; --mdc-ripple-left:8px; --mdc-ripple-top:8px;"><input type="checkbox" class="mdc-checkbox__native-control"><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" stroke="white" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path></svg><div class="mdc-checkbox__mixedmark"></div></div></div>'
  );
  $("li.opened.parent > ul > li > a").click(function() {
    location.reload();
  });

  assignments = new Array();
  categories = new Array();
  //read assignments and create Assignment objects
  $(".line").each(function() {
    assignments.push(new Assignment().nice2CU($(this)));
  });

  //read categories and create Category objects
  $("table.table-condensed > tbody > tr").each(function() {
    categories.push(new Category().nice2CU($(this)));
  });

  calEach(categories, assignments);

  // alert("The total average is " + totalAverage * 100 + " out of 100.");
  //start dealing with displaying

  $("div.content-block > hr.divider")
    .first()
    .after(
      '<div class="assignments-progress-chart gradebook-progress-chart" style="height: 100%" ><canvas id="myChart" width="50%" height="10%"></canvas></div>' +
        '<hr class="divider"></hr>'
    );
  gradeChart = document.getElementById("myChart").getContext("2d");
  thisChart = new Chart(gradeChart, chartDetail());
  $("#canvasBack")
    .first()
    .attr("style", "position: relative;left: 200px;top: 50px;");
  $("#myChart").click(() => {
    thisChart.data.datasets.forEach(dataset => {
      theta = Math.random() * 100;
      dataset.data[0].x += (Math.sin(theta) * 10) / dataset.data[0].r;
      dataset.data[0].y += (Math.cos(theta) * 10) / dataset.data[0].r;
    });
    thisChart.update();
  });
  $("#myChart").dblclick(() => {
    calEach(categories, assignments);
    thisChart.data = chartDetail().data;
    thisChart.update();
  });
}
//createClassAssignment
var Assignment = function() {
  this.context = {
    subject: $(".content-block-header h3").text(),
    dueDate: null,
    name: null
  };
  this.score = {
    get: 0,
    full: 0,
    percentage: 0
  };

  this.category = null;
  this.isSummative = 0;
  this.activated = false;
};
Assignment.prototype.validate = function(htmlObject) {
  //  this.activated = this.checkScored();
  return this.checkScored() && this.isSummative ? htmlObject.click() : 0;
};
Assignment.prototype.checkScored = function() {
  return isNaN(this.score.full) || typeof this.score.full != "number"
    ? false
    : true;
};
Assignment.prototype.activationChange = function() {
  if (this.activated) {
    this.activated = false;
    return false;
  } else {
    this.activated = true;
    return true;
  }
};
Assignment.prototype.calcPercentage = function() {
  if (this.checkScored()) {
    this.score.percentage = this.score.get / this.score.full;
    // alert(this.score.percentage);
    return this.score.percentage;
  } else {
    this.score.percentage = 0;
    return 0;
  }
};
Assignment.prototype.introduce = function() {
  txt =
    "This" +
    (this.activated ? " activated " : " inactivated ") +
    "assignment is for " +
    this.context.subject +
    ", name is " +
    this.context.name +
    " and due on " +
    this.context.dueDate +
    " " +
    (this.checkScored()
      ? "The full score is " +
        this.score.full +
        " and you got " +
        this.score.get +
        ". Percentage is " +
        this.calcPercentage()
      : " This assignment is not scored yet.");
  alert(txt);
};
Assignment.prototype.nice2CU = function(htmlObject) {
  var ass = this;
  htmlObject.click(function() {
    if (ass.activationChange()) {
      $(this).addClass("highlight");
    } else {
      //     alert(1);

      $(this).removeClass("highlight");
    }
    return 1;
  });
  //alert(this.context);
  this.context.name = htmlObject.find(".title > a").text();
  //alert(this.context.name);
  var date = new Date();
  var month = htmlObject
    .find(".past-due .month")
    .text()
    .toLowerCase();
  var monthNum =
    "janfebmaraprmayjunjulaugsepoctnovdec".indexOf(month.toLowerCase()) / 3;
  var day = htmlObject.find(".past-due .day").text();
  date.setMonth(monthNum);
  date.setDate(day);
  this.context.date = date;
  //this.score.get = parseInt(htmlObject.find('.label-points').text());
  this.score.get = parseInt(
    htmlObject
      .find(".label-score")
      .text()
      .split(" / ", 2)[0]
  );
  this.score.full = parseInt(
    htmlObject
      .find(".label-score")
      .text()
      .split(" / ", 2)[1]
  );
  this.category = htmlObject.find(".labels-set > .label:last").text();
  this.isSummative =
    htmlObject.find(".labels-set > .label:first").text() == "Summative" ? 1 : 0;
  //this.introduce();
  this.validate(htmlObject);
  return this;
};
//createClassCategory
var Category = function() {
  this.weight = null;
  this.nameStr = null;
  this.count = 0;
  this.totalVal = 0;
  this.average = 0;
  this.color = null;
  this.activated = false;
};
Category.prototype.activationChange = function() {
  if (this.activated) {
    this.activated = false;
    return false;
  } else {
    this.activated = true;
    return true;
  }
};
Category.prototype.validate = function(htmlObject) {
  //  this.activated = this.checkScored();
  return this.weight > 0 ? htmlObject.click() : 0;
};
Category.prototype.addData = function(data) {
  //alert('Added data ' + data + ' to category ' + this.nameStr);
  this.totalVal += data;
  this.count += 1;
  //alert(this.count);
  return 1;
};
Category.prototype.calcAverage = function() {
  if (this.count == 0) {
    return 0;
  } else {
    this.average = this.totalVal / this.count;
    return this.average;
  }
};
Category.prototype.introduce = function() {
  // alert('hahaha');
  this.calcAverage();
  //alert(this.count + 'count');
  //alert(this.totalVal + 'total');
  //alert(this.average + 'AVG');
  text =
    "The " +
    this.nameStr +
    " category has weight of " +
    this.weight +
    ". Has " +
    this.count +
    " scores, average score is " +
    this.average +
    ".";
  alert(text);
  return 1;
};
Category.prototype.nice2CU = function(htmlObject) {
  var cat = this;
  htmlObject.click(function() {
    if (cat.activationChange()) {
      $(this).addClass("highlight");
    } else {
      //     alert(1);
      $(this).removeClass("highlight");
    }
    return 1;
  });
  this.nameStr = htmlObject.children(":first").text();
  //alert(this.nameStr);
  this.weight = parseInt(
    htmlObject
      .children(":last")
      .text()
      .replace("%", "")
  );
  //alert(this.weight);
  this.color = htmlObject
    .children(":first")
    .attr("style")
    .replace("color: ", "");
  // alert(this.color);
  this.validate(htmlObject);
  return this;
};

function calEach(categories, assignments) {
  for (let cat = 0; cat < categories.length; cat++) {
    categories[cat].count = 0;
    categories[cat].totalVal = 0;
    for (let ass = 0; ass < assignments.length; ass++) {
      //alert(categories[cat].nameStr + assignments[ass].context.name);
      if (
        categories[cat].nameStr == assignments[ass].category &&
        assignments[ass].activated == true
      ) {
        // alert(categories[cat].count);
        categories[cat].addData(assignments[ass].calcPercentage());
      }
    }
    categories[cat].calcAverage();
    //   categories[cat].introduce();
  }
}

function totalAverage() {
  var scoreSum = 0;
  var weightSum = 0;
  for (let index = 0; index < categories.length; index++) {
    cat = categories[index];
    if (cat.activated) {
      scoreSum += cat.average * cat.weight;
      weightSum += cat.weight;
      // alert(cat.weight);
    }
  }
  return scoreSum / weightSum;
}

function chartDetail() {
  chartDef = {
    type: "bubble",
    // The data for our dataset
    data: {
      datasets: []
    },
    // Configuration options go here
    options: {
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
      }
    }
  };
  for (let cat = 0; cat < categories.length; cat++) {
    newDataSet = {
      backgroundColor: categories[cat].color,
      borderColor: categories[cat].color,
      data: [
        {
          x: Math.random() + cat * 2,
          y: Math.random(),
          r: Math.log2(categories[cat].weight + 2) * 10,
          score: categories[cat].calcAverage()
        }
      ],
      label: categories[cat].nameStr
    };
    chartDef.data.datasets.push(newDataSet);
  }
  chartDef.data.datasets.push({
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
  return chartDef;
}
