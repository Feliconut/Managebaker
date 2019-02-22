window.mdc.autoInit();
mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));


$("#check").click(function () {
    
    document.getElementById("urlresult").innerHTML("checking");
    var startDate = new Date();
    var endDate = new Date();
    startDate.Add(-1, "y");
    endDate.Add(1, "y");
    endDate.Add(-1, "d");

    var url = "https://"+ document.getElementById("subdomain").value + ".managebac." + document.getElementById("root").value + "/student/events.json";
    var dateData = {
        start: startDate.Format("yyyy-MM-dd"),
        end: endDate.Format("yyyy-MM-dd")
    };
    try {
        $.get(
            url,
            dateData,
            function (result, status) {
                console.log(result,status)
               
            },
            "json"
        );
    } catch {
        throw "queryError";
    }
})