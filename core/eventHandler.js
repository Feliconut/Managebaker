// Event Handler Object
/*
===INTERFACE===
eventHandler.run(?#<eventHandler.mode>mode, ?#<func>allCallback, ?#<func>singleCallback) : void

  #mode:
    -> eventHandler.mode.fetchAll
    -> eventHandler.mode.roolingUpdate        (default)

  #allCallback:
    function()

  #singleCallback:
    function(localForageKey, value)

eventHandler.get(#<integer | string>event_id)    : #<obj>event_data
eventHandler.get(#configRef)                     : #<obj>

  #event_data:
    format : eventHandler.local.event.template

  #configRef:
  -> eventHandler.local.event                 (will return null)
  -> eventHandler.local.config
  -> eventHandler.local.classes
  (extendable)

*/
const eventHandler = {};
eventHandler.mode = {
    FETCH_ALL: Math.random(),
    ROLLING_UPDATE: Math.random()
};
eventHandler.local = {
    event: {
        type: 'event',
        key: null,
        template: {
            title: '',
            start: null,
            url: null,
            complete: 0,
            category: '',
            classId: '',
            score: {
                get: 0,
                total: 0
            }
        },
        validate: (obj) => {
            return obj && 1 && !obj.hasOwnProperty('temp');
        },
        autoFix: async () => {
            // await eventHandler.run(eventHandler.mode.ROLLING_UPDATE);
            return 1;
        },
    },
    config: {
        type: 'config',
        key: 'config',
        template: {
            agree: 0,
            domain: "",
            subdomain: "",
            root: "",
            installDate: new Date()
        },
        validate: (obj) => {
            return obj && 1 && !obj.hasOwnProperty('temp');
        },
        autoFix: async () => {
            console.log('attempt to fix config');
            jsonObj = {
                agree: 0,
                domain: "",
                subdomain: "",
                root: "",
                installDate: new Date()
            };
            localforage.setItem("config", jsonObj);
            return 1;
        },
    },
    classes: {
        type: 'classes',
        key: 'classes',
        template: [],
        validate: (obj) => {
            return obj && 1 && !obj.hasOwnProperty('temp');
        },
        autoFix: async () => {
            await import("../lib/jquery-3.3.1.js");
            // await import("../lib/localforage")
            var configValue = await eventHandler.get(eventHandler.local.config);
            await $.ajax({
                url: 'https://' + configValue.domain + '/student/',
                success: async (data) => {
                    //READ ALL CLASSES FROM HTML
                    var classes_raw = $(data).find(".parent:eq(1)").html();
                    var classes_list = [];
                    var defaults = await import('./defaults.js');
                    $(classes_raw).find("li").each(async function () {
                        var href = $(this).find("a").attr("href");
                        var name = $(this).find("a").text().slice(2, -2);
                        if (href != "/student/classes") {
                            var id = href.slice(href.length - 8, href.length);
                            var new_class_setting = defaults.classSetting(name);
                            new_class_setting.href = href;
                            new_class_setting.id = id;
                            classes_list.push(new_class_setting);
                        }
                    });
                    await localforage.setItem(eventHandler.local.classes.key, classes_list)
                    return 1;
                }
            });
        }
    },
    user: {
        type: 'user',
        key: 'user',
        template: {
            userid: '',
            img: '',

        }

    }
    // ,
    // students: {
    //     type: 'students',
    //     key: 'studnets_data',
    //     template: [],
    //     validate: (obj) => {
    //         // return 1 && !obj.hasOwnProperty('temp');
    //         return 0
    //     },
    //     autoFix: async () => {
    //         await import("../lib/jquery-3.3.1.js");
    //         var configValue = await eventHandler.get(eventHandler.local.config);
    //         var defaults = await import('./defaults.js');
    //         var classes_data = await eventHandler.get(eventHandler.local.classes);
    //         console.log(classes_data)

    //         var students = {}
    //         var class_ids = defaults.class_ids;
    //         // console.log(classes_data)




    //         var loadSingleClass = async function (class_item) {
    //             console.log('enter loop ')
    //             console.log(class_item)
    //             await $.ajax({
    //                 url: 'https://' + configValue.domain + '/student/classes/' + class_item.id + '/students',
    //                 success: async (data) => {
    //                     // console.log(data)
    //                     //READ ALL STUDENTS FROM HTML
    //                     var studnts_raw = $(data).find('tbody > tr')
    //                     $(studnts_raw).each(async function () {
    //                         console.log('each student')
    //                         var nameTag = $(this).find("td");

    //                         var name = $(nameTag).find("div").text();
    //                         var id = $(nameTag).find("div").attr("data-id");
    //                         var img_style = $(nameTag).find("div").attr("style");
    //                         var online = $(nameTag).find("div").hasClass('online');
    //                         console.log(students)
    //                         if (students.hasOwnProperty(id)) {
    //                             console.log('in!')
    //                             if (students[id].classes.indexOf(class_item) > -1) {} else {
    //                                 students[id].classes.push(class_item);
    //                             }
    //                         } else {
    //                             console.log('not in!')
    //                             students[id] = {
    //                                 name,
    //                                 id,
    //                                 online,
    //                                 img_style,
    //                                 classes: [class_item]
    //                             }
    //                         }

    //                     });
    //                 }

    //             });
    //         };
    //         classes_data.forEach(async (item) => {
    //             // class_ids.push(item.id);
    //             await loadSingleClass(item);
    //         });
    //         console.log('execute this!');

    //         await localforage.setItem(eventHandler.local.students.key, students);
    //     }

    // }
};
eventHandler.generateDates = async function (mode = null) {
    var a = await import('../lib/usefulUtil.js');
    a.dateEnhance.init();
    // a.sayHello('dateEnhanced')
    //Code begin here
    var startDate = new Date();
    var endDate = new Date();
    switch (mode) {
        case this.mode.FETCH_ALL: {
            startDate.Add(-1, "y");
            endDate.Add(1, "y");
            break;
        }
        case this.mode.ROLLING_UPDATE: {
            startDate.Add(-1, "y");
            endDate.Add(1, "y");
            break;
        }
        default: {
            startDate.Add(-1, "M");
            endDate.Add(1, "M");
            console.log('handlerModeException, running default');
            break;
        }
    }
    endDate.Add(-1, "d");
    var dateData = {
        start: startDate.Format("yyyy-MM-dd"),
        end: endDate.Format("yyyy-MM-dd")
        // start: "2018-01-01",
        // end: "2020-01-01"
    };
    return dateData;
};
eventHandler.query = async function (dateData, allCallback = async () => { }, singleCallback = async () => { }) {
    await import("../lib/localforage.min.js");
    await import("../lib/jquery-3.3.1.js");
    console.log('enterEventHandler');
    // console.log(dateData);
    var config = await eventHandler.get("config");
    if (config === null) {
        throw 'noConfigSet';
    }
    var url = "https://" + config.domain + "/student/events.json";
    var allCalbackParam = [];
    try {
        await $.get(url, dateData, async function (result, status) {
            result.forEach(async (event) => {
                if (typeof event.id != "number") {
                    return;
                }
                var id = String(event.id);
                var event_data = {
                    title: event.title,
                    start: new Date(event.start),
                    url: event.url,
                    complete: 0,
                    category: event.category,
                    classId: '',
                    score: {
                        get: 0,
                        total: 0
                    }
                };
                //检查event的类型,写入classId
                var regPat = new RegExp("student/classes/[0-9]+");
                var ibPat = new RegExp("student/ib");
                var eventPat = new RegExp("/events/")
                if (regPat.test(event.url)) {
                    event_data.classId = event.url.slice(17, 25);
                } else if (ibPat.test(event.url)) {
                    event_data.classId = "ib";
                } else if (eventPat.test(event.url)) {
                    event_data.classId = "event";
                }
                //如果在安装日期前则标记为complete
                // console.log(config.installDate)
                // console.log(event_data.start)
                if ((new Date(config.installDate)).getTime() > event_data.start.getTime()) {

                    // alert(1)
                    event_data.complete = 1
                }

                //已存在->重新写入保留complete
                //get "complete" key and preserve it, overwrite other
                var thisValue = await localforage.getItem(id);
                if (thisValue != null) {

                    event_data.complete = thisValue.complete;
                    event_data.score = thisValue.score;

                }
                await localforage.setItem(id, event_data);
                allCalbackParam.push({
                    id,
                    event_data
                });
                await singleCallback(id, event_data);
            });
            return 1;
        }, "json");
        await allCallback(allCalbackParam);
        console.log('eventHandler.query - finished');
        return 1;
    } catch (err) {
        console.log(err);
        return 0;
    }
};
eventHandler.run = async function (mode = null, allCallback = () => { }, singleCallback = () => { }) {
    var dateData = await this.generateDates(mode);
    await this.query(dateData, allCallback, singleCallback);
    //chrome.alarm 周期性 eventHandler
    // var alarmInfo = {
    //     periodInMinutes: 30
    // };
    // chrome.alarms.create('eventHandler', alarmInfo);
};
eventHandler.get = async function (request, additionData, maxFix = 3) {
    await import("../lib/localforage.min.js");

    // if (recur) {
    //   console.log('enter recur ' + recur);
    // }
    var key;
    if (typeof request == 'string' || typeof request == 'number') {
        key = request.toString();
        request = eventHandler.local.event;
    } else if (request.hasOwnProperty('key')) {
        key = request.key.toString();
    } else {
        throw 'invalid get request';
    }
    var fetchedValue = await localforage.getItem(key);

    if (request.validate(fetchedValue)) {
        return fetchedValue;
        //if still recurring then:
        //auto-fix strategy
    } else {
        if (request.type == 'event') {
            return null
        }

        var i = 1;
        while (i < maxFix) {
            console.log('try autofix ' + i + ' / ' + maxFix);
            await request.autoFix();
            fetchedValue = await localforage.getItem(key);
            //send back the result
            if (request.validate(fetchedValue)) {
                return fetchedValue;
            }
            i = i + 1;
        }
        //if no more recur then setup default template
        //template will be overwritten by eventHandler.query()
    }
    console.log(key + ' not found, set template instead');
    // if (request.type == 'event') {
    //     return null
    // }
    var valueToSet = request.template;
    valueToSet.temp = 1;
    for (const attr in additionData) {
        if (additionData.hasOwnProperty(attr)) {
            if (attr in valueToSet) {
                valueToSet[attr] = additionData[attr];
                console.log('load data ' + attr + " = " + additionData[attr])
            }
        }
    }
    await localforage.setItem(key, valueToSet);
    return valueToSet;
};
eventHandler.delete_all_data = async function () {
    await import("../lib/localforage.min.js");
    await localforage.clear();
    var jsonObj = {
        agree: 1,
        domain: "",
        subdomain: "",
        root: "",
        installDate: new Date()
    };
    await localforage.setItem("config", jsonObj);
}

export default eventHandler;