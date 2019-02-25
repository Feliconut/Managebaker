import '../lib/localforage.min'
import '../lib/material/material'
import '../lib/usefulUtil'
import '../lib/jquery-3.3.1'

localforage.getItem("config").then(function (value) {
    var jsonObj = value;
    document.getElementById("subdomain").value = jsonObj["subdomain"];
    document.getElementById("root").value = jsonObj["root"];
    $("#subdomain").attr("value", "Pre-filled value");
    $("subdomain-label").attr("for", "tf-outlined prefilled");
    $("subdomain-label").addClass("mdc-floating-label--float-above")
    document.getElementById("urlresult").innerHTML = "OK :)";
    window.mdc.autoInit();
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
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
                jsonObj["domain"] = document.getElementById("subdomain").value + '.managebac.' document.getElementById("root").value;
                localforage.setItem("config", jsonObj);
            })
        },
        error: function () {
            document.getElementById("urlresult").innerHTML = "failed. Please check spelling and login status.";
        }
    })
})