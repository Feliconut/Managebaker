const oauth = {};

oauth.get = async function (mode = null) {
    await import("../lib/localforage.min.js");
    await import("../lib/jquery-3.3.1.js");
    console.log('enterOauth');









    
}


oauth.basicuserinfo = async function (mode) {
    await import("../lib/localforage.min.js");
    await import("../lib/jquery-3.3.1.js");
    var config = await eventHandler.get("config");
    var profile_link = 'https://' + config.domain + '/student/profile';
    await fetch(profile_link)
        .then(data => data.text())
        .then(async function (data) {
            var user = {
                school: config.subdomain,
                region: config.root,
                first_name: $(data).find("[for='user_first_name']").next().text(),
                last_name: $(data).find("[for='user_last_name']").next().text(),
                perfer_name: $(data).find(".profile-link").text().slice(2, -1),
                email: $(data).find("[for='user_email']").next().text(),
                userid: $(data).find(".profile-link").find("a").find("div").attr("data-id"),
                photo: await fetch($(data).find(".profile-link").find("a").find("div").css("background-image").slice(5, -2)).then(data => data.blob())
            }
            console.log(user)
        })



        
}

export default oauth;