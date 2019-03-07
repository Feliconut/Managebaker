// Promise.all([
//     import('../lib/localforage.min.js'),
//     import('../lib/material/material.js'),
//     import('../lib/usefulUtil.js'),
//     import('../lib/jquery-3.3.1.js')
// ]).then(function (a) {
//     console.log(a)
import('../lib/usefulUtil.js').then((a) => {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
    a.dateEnhance.init();
    localforage.getItem("config").then(function (value) {
        if (value.domain != "0") {
            var jsonObj = value;
            document.getElementById("subdomain").value = jsonObj["subdomain"];
            document.getElementById("root").value = jsonObj["root"];
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
                jsonObj["subdomain"] = document.getElementById("subdomain").value;
                jsonObj["root"] = document.getElementById("root").value;
                jsonObj["domain"] = document.getElementById("subdomain").value + '.managebac.' + document.getElementById("root").value;
                document.getElementById("root").value;
                localforage.setItem("config", jsonObj);
            })
            getclasses();
        },
        error: function () {
            document.getElementById("urlresult").innerHTML = "failed. Please check spelling and login status.";
        }
    });
    //eventHandler for all
});

function getclasses() {
    localforage.getItem("config").then(function (value) {
        domain = value["domain"]
        url = ' https://' + domain + '/student/'
        html = $.ajax({
            url: url,
            success: function (data) {
                $("table").replaceWith('<table class="table"> <tr> <th>#</th> <th>class</th> <th>abbreviation</th> <th>color</th> <th>Method</th> </tr></table>');
                var classes_raw = $(data).find(".parent:eq(1)").html();
                var i = 1;
                $(classes_raw).find("li").each(function () {
                    var href = $(this).find("a").attr("href")
                    var name = $(this).find("a").text()
                    if (href != "/student/classes") {
                        var id = href.slice(href.length - 8, href.length);
                        $("table tbody:last").append('<tr> <th> <p style="margin-top:14px">' +
                            i +
                            '</p> </th> <th> <p style="margin-top:14px">' +
                            name +
                            '</p> </th> <th> <div class="mdc-text-field mdc-text-field--outlined" style="width: 100%;float:left;" data-mdc-auto-init="MDCTextField"> <input type="text" id="'
                             + id + 
                             '" class="mdc-text-field__input"> <div class="mdc-notched-outline"> <div class="mdc-notched-outline__leading"></div> <div class="mdc-notched-outline__notch"> </div> <div class="mdc-notched-outline__trailing"></div> </div> </div> </th> <th><span class="badge badge-pill" style="background-color:#FF304F;" title="#FF304F">&nbsp;</span></th> <th> <div class="mdc-select mdc-select--outlined" style="width:100%;float:left;" data-mdc-auto-init="MDCSelect"> <i class="mdc-select__dropdown-icon"></i> <select class="mdc-select__native-control"> <option value="" disabled selected></option> <option value="1"> percentage weights </option> <option value="2"> percentage weights with points based averaging </option> <option value="2"> absolute weights </option> </select> <div class="mdc-notched-outline"> <div class="mdc-notched-outline__leading"></div> <div class="mdc-notched-outline__notch"> </div> <div class="mdc-notched-outline__trailing"></div> </div> </div> </th> </tr>');
                        i++;
                    }
                });
                window.mdc.autoInit();
            },
            error: function () {
                document.getElementById("urlresult").innerHTML = "failed. Please check spelling and login status.";
            }
        })

    })


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