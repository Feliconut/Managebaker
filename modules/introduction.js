var number = 0;

function intro() {
	//hover
	var hover = document.createElement('div');
	hover.style.width = '100%';
	hover.style.top = '0px';
	hover.style.background = '#666666';
	hover.style.position = 'fixed';
	hover.style.zIndex = 10010;
	hover.style.height = '-webkit-fill-available'
	hover.style.opacity = 0.5;
	hover.id = "hover"
	document.body.appendChild(hover)
	var div = '<div id="box" style="border: dashed brown; position: absolute;z-index:10020;background:white;border-width: 2px;border-radius:7px;min-width:175px;padding:5px"><p id="context" style="font-size:20px;"></p><button class="mdc-button mdc-button--outlined mdc-ripple-upgraded" style="width:50px;font-size:14px;margin-bottom: 5px;margin-left: 5px;" id="next">next</button></div>'
	$("body").append(div);
	next();
}
intro();

$("#next").click(function () {
	next();
})

function next() {
	var data = [{
			context: 'Only messages here',
			position: {
				top: '60px',
				left: 'calc(100% - 250px)'
			}
		}, {
			context: 'Access nav bar here',
			position: {
				top: $("#utilTab1").offset().top + 'px',
				left: '260px'
			}
		},{
			context: 'You can use checkbox to mark events as finished',
			position: {
				top: ($("h3:contains(Upcoming Events or Deadlines)").offset().top - 40) + 'px',
				left: '260px'
			}
		},{
			context: 'We also have grade chart for you to discover',
			position: {
				top: ($("h3:contains(Upcoming Events or Deadlines)").offset().top - 40) + 'px',
				left: '260px'
			}
		}
	]
	if (number == data.length) {
		$("#hover").remove();
		$("#box").remove();
	}
	$("#context").text(data[number].context)
	document.getElementById("box").style.top = data[number].position.top;
	document.getElementById("box").style.left = data[number].position.left;
	number++;
}