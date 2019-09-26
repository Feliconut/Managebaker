/*
数据管理模块，导入和导出用户数据
*/
const packer = {
    //return string containing all user data
    packup: (sourceData) => {
        var complete = [];
        var incomplete = [];
        var packed_data = {};
        packed_data.EVENT_IDS = [];
        packed_data.parity = null;

        for (var key in sourceData) {
            const val = sourceData[key];
            if (val.hasOwnProperty('complete')) {
                if (val.complete) {
                    complete.push(key);
                } else {
                    incomplete.push(key);
                }
            } else {
                console.log('load ' + key)
                packed_data[key] = val;
            }
        }
        if (complete.length < incomplete.length) {
            packed_data.EVENT_IDS = complete;
            packed_data.parity = 1;
        } else {
            packed_data.EVENT_IDS = incomplete;
            packed_data.parity = 0;
        }

        packed_data.TIME = new Date();

        console.log(packed_data);
        return encodeURI(JSON.stringify(packed_data));
    },
    //write all data into localforage, return stat code
    unpack: (raw_data) => {
        var data;

        data = raw_data.data[0].data;
        data = decodeURI(data);
        data = JSON.parse(data);

        // console.log(data)
        return data;
    }
}

const security = {
    //return encrypted string
    encryp: (raw, key) => {},
    //return decrypted string
    decryp: (encrypted, key) => {},
};

export const dataIO = {
    local: {
        //return read string
        read: () => {},
        //return status code
        write: (data, path, mode) => {}
    },
    online: {
        //return read string
        read: async (time, callback = (foo) => {}) => {
            function updateProc(iterationNumber) {
                if (iterationNumber % 10 == 0) {

                    var proc = 0.7 + Math.atan(iterationNumber * 0.01) * 2 / Math.PI * 0.3;
                    callback(proc);
                    console.log(proc);
                }
                return;
            }
            //fetch & process raw data
            var userinfo = await eventHandler.get("user");
            let formData = new FormData();
            formData.append('id', userinfo.id);
            formData.append('client_token', userinfo.client_token);
            formData.append('time', time);
            callback(0.3);
            var raw_data = await fetch('https://managebaker.com/API/public/user/recoverdata', {
                method: 'POST',
                body: formData,
            }).then(response => response.json());

            var object = packer.unpack(raw_data);
            callback(0.5);

            //read data
            if (object.hasOwnProperty('EVENT_IDS')) { //new data struct
                await eventHandler.run(eventHandler.mode.FETCH_ALL);
                await sleep(0.5);
                callback(0.7);

                //treating events
                if (object.parity == 0) {
                    await localforage.iterate(function (value, key, iterationNumber) {
                        if (value.hasOwnProperty('complete')) { //is a event
                            if (value.start < new Date(object.TIME)) { //start before saving
                                if (object.EVENT_IDS.indexOf(key) > -1) { //saved "incomplete"
                                    if (value.complete) {
                                        value.complete = 0;
                                        console.log('switch ' + key + " to 0")
                                        localforage.setItem(key, value);
                                    }
                                } else if (!value.complete) {
                                    value.complete = 1;
                                    console.log('switch ' + key + " to 1")
                                    localforage.setItem(key, value);
                                }
                            } else if (value.complete) {
                                value.complete = 0;
                                console.log('switch ' + key + " to 0")
                                localforage.setItem(key, value);
                            }
                        }

                        updateProc(iterationNumber)

                    });
                } else { //parity 1
                    await localforage.iterate(function (value, key, iterationNumber) {
                        if (value.hasOwnProperty('complete')) { //is a event

                            if (object.EVENT_IDS.indexOf(key) > -1) { //saved "complete"
                                if (!value.complete) {
                                    value.complete = 1;
                                    localforage.setItem(key, value);
                                }
                            } else if (value.complete) {
                                value.complete = 0;
                                localforage.setItem(key, value);
                            }
                        }
                        updateProc(iterationNumber)
                    });
                }

                //treating others
                localforage.setItem("classes", object.classes);
                localforage.setItem("config", object.config);

            } else { //Compatible with older version
                console.log('start old data load')
                var i = 0
                var count = Object.keys(object).length;
                for (var key in object) {
                    if (/^[0-9]+$/.test(key)) {
                        object[key].start = new Date(object[key].start)
                    } else if (key = "config") {
                        object[key].installDate = new Date(object[key].installDate)
                    }
                    await localforage.setItem(key, object[key])
                        .then(
                            function () {
                                i++;
                                var proc = 0.7 + i / count * 0.3;
                                callback(proc);
                            })
                }
            }

        },

        write: async () => {
            var auth = await import('./auth.js');
            auth = auth.default;

            var basicuserinfo = await auth.basicuserinfo();
            var data = {};
            await localforage.iterate(function (value, key, iterationNumber) {
                if (key == "user") {
                    value["photo"] = null;
                }
                data[key] = value;
            })
            // var dat = encodeURI(JSON.stringify(data));
            var dat = packer.packup(data);
            var a = await import('../lib/usefulUtil.js');
            a.dateEnhance.init();
            var date = new Date()
            let formData = new FormData();
            formData.append('id', basicuserinfo.id);
            formData.append('client_token', basicuserinfo.client_token);
            formData.append('date', date.Format("yyyyMMdd"));
            formData.append('data', dat);
            try {
                var result = await fetch('https://managebaker.com/API/public/user/upload', {
                    method: 'POST',
                    body: formData
                });
                return result.data;

            } catch (err) {
                return null;
            }

        }
    }
};

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}