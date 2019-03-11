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
            await eventHandler.run(eventHandler.mode.ROLLING_UPDATE);
            return 1;
        },
    },
    config: {
        key: 'config',
        template: {
            agree: 0,
            domain: "0",
            subdomain: "",
            root: ""
        },
        validate: (obj) => {
            return obj && 1 && !obj.hasOwnProperty('temp');
        },
        autoFix: async () => {
            console.log('attempt to fix config');
            return 1;
        },
    },
    classes: {
        key: 'classes',
        template: [],
        validate: (obj) => {
            return obj.length && 1 && !obj.hasOwnProperty('temp');
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
                    $(classes_raw).find("li").each(function () {
                        var href = $(this).find("a").attr("href");
                        var name = $(this).find("a").text();
                        if (href != "/student/classes") {
                            var id = href.slice(href.length - 8, href.length);
                            classes_list.push({
                                name: name,
                                href: href,
                                id: id
                            });
                        }
                    });

                    await localforage.setItem(eventHandler.local.classes.key, classes_list)
                    return 1;
                }

            });
        }
    }
};
eventHandler.generateDates = async function (mode = null) {
    a = await import('../lib/usefulUtil.js');
    a.dateEnhance.init();
    // a.sayHello('dateEnhanced')
    //Code begin here
    var startDate = new Date();
    var endDate = new Date();
    switch (mode) {
        case this.mode.FETCH_ALL:
            {
                startDate.Add(-1, "y");
                endDate.Add(1, "y");
                break;
            }
        case this.mode.ROLLING_UPDATE:
            {
                startDate.Add(-1, "M");
                endDate.Add(2, "M");
                break;
            }
        default:
            {
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
eventHandler.query = async function (dateData, allCallback = async () => {}, singleCallback = async () => {}) {
    await import(RUNTIME_PATH + "lib/localforage.min.js");
    await import(RUNTIME_PATH + "lib/jquery-3.3.1.js");
    console.log('enterEventHandler');
    // console.log(dateData);
    var config = await eventHandler.get("config");
    if (config === null) {
        throw 'noConfigSet';
    }
    var url = "https://" + config.domain + "/student/events.json";
    var allCalbackParam = [];
    await $.get(url, dateData, async function (result, status) {
        result.forEach(async (event) => {
            if (typeof event.id != "number") {
                return;
            }
            var id = String(event.id);
            var event_data = {
                title: event.title,
                start: event.start,
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
            if (regPat.test(event.url)) {
                event_data.classId = event.url.slice(17, 25);
            } else if (ibPat.test(event.url)) {
                event_data.classId = "ib";
            }
            //get "complete" key and preserve it, overwrite other
            var thisValue = await localforage.getItem(id);
            if (thisValue != null) {
                if (thisValue.complete) {
                    event_data.complete = thisValue.complete;
                }
            }
            //已存在->重新写入保留complete
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
};
eventHandler.run = async function (mode = null, allCallback = () => {}, singleCallback = () => {}) {
    var dateData = await this.generateDates(mode);
    await this.query(dateData, allCallback, singleCallback);
    //chrome.alarm 周期性 eventHandler
    var alarmInfo = {
        periodInMinutes: 30
    };
    chrome.alarms.create('eventHandler', alarmInfo);
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
    console.log('eventHander.get ->' + key);

    if (request.validate(fetchedValue)) {
        return fetchedValue;
        //if still recurring then:
        //auto-fix strategy
    } else {
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

    var valueToSet = request.template;
    valueToSet.temp = 1; //add temp mark



    // console.log(additionData);
    //load additionData
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

export default eventHandler;