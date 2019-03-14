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

async function fetchClasses() {
    eventHandler = await import("../core/eventHandler.js");
    eventHandler = eventHandler.default;
    classes_list = await eventHandler.get(eventHandler.local.classes);
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
            '</p> </th> <th style="vertical-align:middle"> <p style="margin-bottom:0 !important">' +
            thisClass.name.slice(2, thisClass.name.length - 2) +
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
    });
    return 1;
}


$("#save").click(function () {


    for (var n = 0; n < classnumber; n++) {


        console.log(class_id[n], className);


    }







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
        success: function () {
            document.getElementById("urlresult").innerHTML = "success";
            localforage.getItem("config").then(function (value) {
                var jsonObj = value;
                jsonObj.subdomain = document.getElementById("subdomain").value;
                jsonObj.root = document.getElementById("root").value;
                jsonObj.domain = document.getElementById("subdomain").value + '.managebac.' + document.getElementById("root").value;
                localforage.setItem("config", jsonObj);
            });
            fetchClasses();
        },
        error: function (err) {
            document.getElementById("urlresult").innerHTML = "failed. Please check spelling and login status.";
        }
    });
    //eventHandler for all
});