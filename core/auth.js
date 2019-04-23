const auth = {};

auth.basicuserinfo = async function (mode) {
    await import("../lib/localforage.min.js");
    await import("../lib/jquery-3.3.1.js");
    await import("../lib/md5.js")
    var config = await eventHandler.get("config");
    var profile_link = 'https://' + config.domain + '/student/profile';
    var manifestData = chrome.runtime.getManifest();

    function getBase64(img) {
        function getBase64Image(img, width, height) { //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
            var canvas = document.createElement("canvas");
            canvas.width = width ? width : img.width;
            canvas.height = height ? height : img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL();
            return dataURL;
        }
        var image = new Image();
        image.src = img;
        var deferred = $.Deferred();
        if (img) {
            image.onload = function () {
                deferred.resolve(getBase64Image(image));
            }
            return deferred.promise();
        }
    }
    var basicuserinfo = await fetch(profile_link)
        .then(data => data.text())
        .then(async function (data) {
            var user = {
                school: config.subdomain,
                region: config.root,
                first_name: $(data).find("[for='user_first_name']").next().text(),
                last_name: $(data).find("[for='user_last_name']").next().text(),
                prefer_name: $(data).find(".profile-link").text().slice(2, -1),
                email: $(data).find("[for='user_email']").next().text(),
                id: $(data).find(".profile-link").find("a").find("div").attr("data-id"),
                photo: await getBase64($(data).find(".profile-link").find("a").find("div").css("background-image").slice(5, -2)),
                client_token: $.md5(config.subdomain + config.root + $(data).find("[for='user_email']").next().text() + manifestData.name)
            }
            localforage.setItem("user", user);
            return user
        });
    return basicuserinfo
}

auth.userinfo = async function () {
    var userinfo = await eventHandler.get("user");
    return userinfo
}

auth.register = async function () {
    var basicuserinfo = await auth.basicuserinfo();
    let formData = new FormData();
    formData.append('id', basicuserinfo.id);
    formData.append('school', basicuserinfo.school);
    formData.append('region', basicuserinfo.region);
    formData.append('first_name', basicuserinfo.first_name);
    formData.append('last_name', basicuserinfo.last_name);
    formData.append('prefer_name', basicuserinfo.prefer_name);
    formData.append('email', basicuserinfo.email);
    formData.append('photo', basicuserinfo.photo);
    formData.append('client_token', basicuserinfo.client_token);
    var result = await fetch('https://managebaker.com/API/public/user/register', {
        method: 'POST',
        body: formData,
    })
    return result.data;
}

auth.login = async function () {
    var basicuserinfo = await auth.basicuserinfo();
    let formData = new FormData();
    formData.append('id', basicuserinfo.id);
    formData.append('client_token', basicuserinfo.client_token);
    var result = await fetch('https://managebaker.com/API/public/user/login', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json()
            .then(function (response) {
                if (response.data.status == 'failed') {
                    console.log("!")
                    var result = auth.register();
                    return result
                }
                return response
            }))
    return result.data;
}









export default auth;