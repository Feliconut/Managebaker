import('../lib/usefulUtil.js').then((a) => {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
    a.dateEnhance.init();
    localforage.getItem("config").then(function (value) {
        if (value.domain != "0") {
            var jsonObj = value;
            document.getElementById("subdomain").value = jsonObj.subdomain;
            document.getElementById("root").value = jsonObj.root;
            $("#subdomain").attr("value", "Pre-filled value");
            $("subdomain-label").attr("for", "tf-outlined prefilled");
            $("subdomain-label").addClass("mdc-floating-label--float-above")
            document.getElementById("urlresult").innerHTML = "OK :)";
        }
        window.mdc.autoInit();
    });
})

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
                document.getElementById("root").value;
                localforage.setItem("config", jsonObj);
            })
            displayClassesOption();
        },
        error: function (err) {
            document.getElementById("urlresult").innerHTML = "failed. Please check spelling and login status.";
        }
    });
    //eventHandler for all
});

async function displayClassesOption() {
    eventHandler = await import("../core/eventHandler.js")
    eventHandler = eventHandler.default
    classes_list = await eventHandler.get(eventHandler.local.classes)
    if (!classes_list) {
        document.getElementById("urlresult").innerHTML = "failed. Please check spelling and login status.";
    }
    window.mdc.autoInit();

    var i = 0;
    $("table").replaceWith('<table class="table"> <tr> <th>#</th> <th>class</th> <th>abbreviation</th> <th>color</th> <th>Method</th> </tr></table>');

    classes_list.forEach((thisClass) => {
        i++;
        $("table tbody:last").append('<tr> <th> <p style="margin-top:14px">' +
            i +
            '</p> </th> <th> <p style="margin-top:14px">' +
            thisClass.name +
            '</p> </th> <th> <div class="mdc-text-field mdc-text-field--outlined" style="width: 100%;float:left;" data-mdc-auto-init="MDCTextField"> <input type="text" id="' +
            thisClass.id +
            '" class="mdc-text-field__input"> <div class="mdc-notched-outline"> <div class="mdc-notched-outline__leading"></div> <div class="mdc-notched-outline__notch"> </div> <div class="mdc-notched-outline__trailing"></div> </div> </div> </th> <th><span class="badge badge-pill" style="background-color:#FF304F;" title="#FF304F">&nbsp;</span></th> <th> <div class="mdc-select mdc-select--outlined" style="width:100%;float:left;" data-mdc-auto-init="MDCSelect"> <i class="mdc-select__dropdown-icon"></i> <select class="mdc-select__native-control"> <option value="" disabled selected></option> <option value="1"> percentage weights </option> <option value="2"> percentage weights with points based averaging </option> <option value="2"> absolute weights </option> </select> <div class="mdc-notched-outline"> <div class="mdc-notched-outline__leading"></div> <div class="mdc-notched-outline__notch"> </div> <div class="mdc-notched-outline__trailing"></div> </div> </div> </th> </tr>');
    });
    window.mdc.autoInit();
    return 1
}






/*

<
tr >
    <
    th >
    <
    p style = "margin-top:14px" > 1 < /p> <
    /th> <
    th >
    <
    p style = "margin-top:14px" > N / A < /p> <
    /th> <
    th >
    <
    div class = "mdc-text-field mdc-text-field--outlined"
style = "width: 100%;float:left;"
data - mdc - auto - init = "MDCTextField" >
    <
    input type = "text"
id = "tf-outlined"
class = "mdc-text-field__input" >
    <
    div class = "mdc-notched-outline" >
    <
    div class = "mdc-notched-outline__leading" > < /div> <
    div class = "mdc-notched-outline__notch" >
    <
    /div> <
    div class = "mdc-notched-outline__trailing" > < /div> <
    /div> <
    /div> <
    /th> <
    th >
    <
    div class = "mdc-select mdc-select--outlined"
style = "width:100%;float:left;"
data - mdc - auto - init = "MDCSelect" >
    <
    i class = "mdc-select__dropdown-icon" > < /i> <
    select class = "mdc-select__native-control" >
    <
    option value = ""
disabled selected > < /option> <
    option value = "1" >
    percentage weights <
    /option> <
    option value = "2" >
    percentage weights with points based averaging <
    /option> <
    option value = "2" >
    absolute weights <
    /option> <
    /select> <
    div class = "mdc-notched-outline" >
    <
    div class = "mdc-notched-outline__leading" > < /div> <
    div class = "mdc-notched-outline__notch" >
    <
    /div> <
    div class = "mdc-notched-outline__trailing" > < /div> <
    /div> <
    /div> <
    /th> <
    /tr>


    */