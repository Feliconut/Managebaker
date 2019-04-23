var user = 0

chrome.runtime.sendMessage({
    "method": "get_user_config"
});

chrome.runtime.onMessage.addListener(function (request, sender) {
    user = request.user;
    if (user != 0) {
        $("#login").attr("disabled", false);
        $("#login").text("Login");
    } else {
        $("#login").text("Failed, please use Managebaker;)");
    }
});

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

$("#login").click(function () {
    if (user != 0) {
        var Request = new Object();
        Request = GetRequest();
        let formData = new FormData();
        formData.append('id', user.id);
        formData.append('client_token', user.client_token);
        formData.append('scope', Request['scope']);
        formData.append('redirect_uri', Request['redirect_uri']);
        formData.append('response_type', Request['response_type']);
        formData.append('approval_prompt', Request['approval_prompt']);
        formData.append('client_id', Request['client_id']);
        formData.append('state', Request['state']);
        fetch('https://managebaker.com/API/public/oauth/authorize', {
                method: 'POST',
                body: formData,
            })
            .then(data => data.json())
            .then(data => setTimeout(redirect(data.data.redirect_uri), 2000));



    } else {
        alert("You must use managebaker to login")
    }


})

function redirect(url) {
    location.href = url;
}