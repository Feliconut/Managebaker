const auth = {};

auth.basicuserinfo = async function (mode) {
    await import("../lib/localforage.min.js");
    await import("../lib/jquery-3.3.1.js");
    await import("../lib/jquery.md5.js")
    var config = await eventHandler.get("config");
    var profile_link = 'https://' + config.domain + '/student/profile';
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
                photo: await fetch($(data).find(".profile-link").find("a").find("div").css("background-image").slice(5, -2)).then(data => data.blob()),
                access_token: $.md5(config.subdomain + config.root + $(data).find("[for='user_email']").next().text() + config.name)
            }
            return user
        });
    return basicuserinfo
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
    formData.append('access_token', basicuserinfo.access_token);
    await fetch('https://managebaker.com/API/public/user/register', {
            method: 'POST',
            body: formData,
        }).then(data =>console.log(data))
        .catch(error => console.error('Error:', error));

}


auth.login =async function()
{
    var basicuserinfo = await auth.basicuserinfo();
    let formData = new FormData();
    formData.append('id', basicuserinfo.id);
    formData.append('access_token', basicuserinfo.access_token);
    await fetch('https://managebaker.com/API/public/user/login', {
            method: 'POST',
            body: formData,
        }).then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
}


auth.get = async function (mode = null) {
    await import("../lib/localforage.min.js");
    await import("../lib/jquery-3.3.1.js");
    console.log('enterOauth');




}









export default auth;