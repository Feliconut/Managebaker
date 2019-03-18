classnumber = 0;
class_id = [];

async function init() {
    a = await import('../lib/usefulUtil.js')
    mdc.ripple.MDCRipple.attachTo(document.querySelector('#check'));
    mdc.ripple.MDCRipple.attachTo(document.querySelector('#save'));
    a.dateEnhance.init();
    value = await localforage.getItem("config");
    if (value.domain != "0") {
        var jsonObj = value;
        document.getElementById("subdomain").value = jsonObj.subdomain;
        document.getElementById("root").value = jsonObj.root;
        $("subdomain-label").attr("for", "tf-outlined prefilled");
        $("subdomain-label").addClass("mdc-floating-label--float-above");
        document.getElementById("urlresult").innerHTML = "OK :)";
    }
    fetchClasses();
    window.mdc.autoInit();
    $(".picker").colorPick({
        'allowCustomColor': false
    });
}
init();

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    color = '#' + parts.join('');
}

async function fetchClasses() {
    eventHandler = await import("../core/eventHandler.js");
    eventHandler = eventHandler.default;
    classes_list = await eventHandler.get(eventHandler.local.classes);
    console.log(classes_list)
    if (!classes_list) {
        document.getElementById("urlresult").innerHTML = "failed. Please check spelling and login status.";
    }
    var i = 0;
    $("table").replaceWith('<table class="table"> <tr> <th>#</th> <th>class</th> <th>abbreviation</th> <th>color</th> <th>Method</th> </tr></table>');
    classes_list.forEach((thisClass) => {
        console.log(thisClass);
        i++;
        class_id.push(thisClass.id);
        $("table tbody:last").append('<tr> <th> <p style="margin-top:14px">' +
            i +
            '</p> </th> <th style="vertical-align:middle"> <p style="margin-bottom:0 !important" id="' + thisClass.id + '_name">' +
            thisClass.name +
            '</p> </th> <th> <div class="mdc-text-field mdc-text-field--outlined" style="width: 100%;float:left;" data-mdc-auto-init="MDCTextField"> <input type="text" id="' +
            thisClass.id +
            '_abbr" class="mdc-text-field__input"> <div class="mdc-notched-outline"> <div class="mdc-notched-outline__leading"></div> <div class="mdc-notched-outline__notch"> </div> <div class="mdc-notched-outline__trailing"></div> </div> </div> </th> <th><div class="picker" id="' +
            thisClass.id +
            '_color"></div></th> <th> <div class="mdc-select mdc-select--outlined" style="width:100%;float:left;" data-mdc-auto-init="MDCSelect"> <i class="mdc-select__dropdown-icon"></i> <select class="mdc-select__native-control" id="' + thisClass.id + '_method"> <option value="" disabled></option> <option value="1"> percentage weights </option> <option value="2"> percentage weights with points based averaging </option> <option value="2"> absolute weights </option> </select> <div class="mdc-notched-outline"> <div class="mdc-notched-outline__leading"></div> <div class="mdc-notched-outline__notch"> </div> <div class="mdc-notched-outline__trailing"></div> </div> </div> </th> </tr>');
        $("#" + thisClass.id + "_color").colorPick({
            'initialColor': thisClass.color
        });
        $("#" + thisClass.id + "_abbr").attr("value", thisClass.abbr);
        switch (thisClass.method) {

            case "1":
                {
                    $("#" + thisClass.id + "_method").val("1");
                    break;
                }
            case "2":
                {
                    $("#" + thisClass.id + "_method").val("2");
                    break;
                }
            case "3":
                {
                    $("#" + thisClass.id + "_method").val("3");
                    break;
                }
        }
        classnumber = i;
    });
    window.mdc.autoInit( /* root */ document, () => {});
    $(".picker").colorPick({
        'allowRecent': false,
        'paletteLabel': '',
    });

    return 1
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
        return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

$("#save").click(async function () {
    await localforage.getItem("classes").then(function (value) {
        for (var n = 0; n < classnumber; n++) {
            var name = document.getElementById(class_id[n] + "_name").innerText;
            var abbr = document.getElementById(class_id[n] + "_abbr").value;
            var color = rgb2hex($("#" + class_id[n] + "_color").css("background-color"))
            var method = document.getElementById(class_id[n] + "_method").value;
            console.log(class_id[n], name, abbr, color, method);
            console.log(value[n])
            var jsonObj = value[n];
            jsonObj.abbr = abbr;
            jsonObj.color = color;
            jsonObj.method = method;
        }
        localforage.setItem("classes", value);
    })







});




$("#check").click(function () {
    document.getElementById("urlresult").innerHTML = "checking";
    var startDate = new Date();
    var endDate = new Date();
    startDate.Add(-1, "d");
    endDate.Add(1, "d");
    endDate.Add(-1, "d");
    var url = "https://" + document.getElementById("subdomain").value + ".managebac." + document.getElementById("root").value + "/student/events.json";
    var dateData = {
        start: startDate.Format("yyyy-MM-dd"),
        end: endDate.Format("yyyy-MM-dd")
    };
    $.ajax({
        url: url,
        data: dateData,
        success: async function () {
            document.getElementById("urlresult").innerHTML = "success";
            value = await localforage.getItem("config")
            var jsonObj = value;
            jsonObj.subdomain = document.getElementById("subdomain").value;
            jsonObj.root = document.getElementById("root").value;
            jsonObj.domain = document.getElementById("subdomain").value + '.managebac.' + document.getElementById("root").value;
            await localforage.setItem("config", jsonObj);

            fetchClasses();
        },
        error: function (err) {
            document.getElementById("urlresult").innerHTML = "failed. Please check spelling and login status.";
        }
    });
    //eventHandler for all
});


//google analytics
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