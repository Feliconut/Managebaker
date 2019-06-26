import {
    toolBox,
} from "./prototypes.js";

//add utilities tab on left panel
export const addUtilitiesTab = new toolBox(

    [
        'global'
    ],
    'addUtilTab',

    function work(type) {
        var pathString =
            "M 401 64 Q 170 84 150 300 Q 164 538 400 550 Q 571 535 604 382 L 664 401 Q 659 320 601 252 Q 517 277 462 337 L 532 361 Q 511 464 401 465 Q 248 447 241 299 Q 247 167 400 150 L 401 133 Q 227 150 221 299 Q 235 464 395 484 Q 520 479 549 369 L 587 379 Q 542 523 404 531 Q 187 527 173 300 Q 185 106 399 82 Z";
        var groupsTab = $("#menu > ul > li:nth-child(11)");
        var utilitiesTab = $(
            '<li class="parent utilities" data-path="Utilities/\d+"><a><svg baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="100 0 560 600" preserveAspectRatio="xMinYMin meet"><path fill-rule="evenodd" fill="#859BBB" d="' +
            pathString +
            '"></path></svg><span class="text-node">Utilities</span></a><ul id="utilTab2" class="nav" data-max-height="129px" style="max-height: 0px;"><li><a href="/student/profile">My Profile </a></li><li><a href="https://accounts.managebac.cn/">Launchpad </a></li><li><a href="/help">Help &amp; Support </a></li><li id="utilTab3"><a id="utilTab3" href="/logout">Logout </a></li></ul></li>'
        );
        utilitiesTab.insertAfter(groupsTab);
        utilitiesTab.click(() => {
            var $1 = $("#utilTab1");
            var $2 = $("#utilTab2");
            $1.toggleClass("opened");
            $2.attr(
                "style",
                $1.hasClass("opened") ? "max-height: 129px" : "max-height: 0px"
            );
        });
    }
);

//add checkbox on assignment objects
export const addCheckbox = new toolBox(

    [
        'global'
    ],
    'addCheckbox',

    function work(type) {
        var all_id = [];
        $(".line").addClass("mdc-list-item");
        //for each, add checkbox
        $(".line").each(function () {
            //get event id
            var string;
            console.log(type)
            if (type.indexOf('Single') > -1) {
                string = window.location.pathname;
            } else {
                string = $(this).find("a").attr("href");
            }
            var event_id = string.slice(string.length - 8, string.length);
            all_id.push(event_id)
            //get event name
            // var name = $(this).find('div.details > h4.title').text();

            var checkbox = $('<div class="mdc-checkbox"><input type="checkbox" class="mdc-checkbox__native-control" id="' + event_id + '" indeterminate = "true"/> <div class="mdc-checkbox__background"> <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"> <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> <div class="mdc-checkbox__mixedmark"></div> </div> </div>')
            $(this).append(checkbox);
            document.getElementById(event_id).indeterminate = false
            document.getElementById(event_id).disabled = true

            // var thisEvent = {
            //     id: event_id
            //     // ,
            //     // additionData: {
            //     //     title: name,
            //     //     start: new Date(999999)
            //     // }
            // }
            // event_update_set.push(thisEvent);
            $(this).on('click', '#' + event_id, function () {
                chrome.runtime.sendMessage({
                    "event_id": event_id,
                    "method": "change_complete_status"
                    // "additionData": {
                    //     title: name
                    // }
                });
            });


        })

        //只有background是能够操作eventHandler并正确访问db.

        chrome.runtime.sendMessage({
            "event_set": all_id,
            "method": "checkboxUpdate"
        });


        // async function checkboxUpdate(event_id) {
        //     var result = await eventHandler.get(event_id)
        //     if (result) {
        //         document.getElementById(event_id).indeterminate = false
        //         document.getElementById(event_id).checked = result.complete
        //         all_id.splice(all_id.indexOf(event_id), 1)
        //     }
        // }
        // //first round update
        // all_id.forEach(async id => {
        //     await checkboxUpdate(id)
        // })

        // console.log(all_id)




    }
);

//generates the grade chart
export const addGradeChart = new toolBox(

    [
        'classAssignmentList',
        'classAssignmentListOld'
    ],

    'addGradeChart',

    async function work(type) {
        //do something
        var mbChart = $(".assignments-progress-chart");
        if (mbChart.length) {
            var gradeHandler = await import('./assignment.js');
            gradeHandler.default()
        }
    }
);

export const Dropbox = new toolBox(

    [
        'classAssignmentSingle'
    ],
    'Dropbox',

    function work(type) {
        //do something
        import('/lib/dropzone.min.js').then(
            $("#assets").addClass("dropzone")
        )
    }
);

export const normalInitGroup = [addUtilitiesTab]
export const DownlaodAsZip = new toolBox(

    [
        'classAssignmentSingle'
    ],
    'DownlaodAsZip',

    async function work(type) {
        await import('/lib/filesaver.js')
        await import('/lib/jszip.js')
        $(".mdc-checkbox").before('<div id="jszipdownload" style="padding: 11px;height: 46px;margin-left:auto !important;float:right;margin-right: 0px !important;margin-top: auto !important;margin-bottom: auto !important;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15l-5-5h3V9h4v4h3l-5 5z"/></svg></div>');
        $("#jszipdownload").click(function () {
            $(document.body).append('<div class="mdc-dialog mdc-dialog--open" role="alertdialog" aria-modal="true" aria-describedby="alert-dialog-description"><div class="mdc-dialog__scrim"></div><div class="mdc-dialog__container"><div class="mdc-dialog__surface"><section id="alert-dialog-description" class="mdc-dialog__content"><p id="dropbox_dialog" style="font-size:20px"></p></section></div></div></div>')
            var zip = new JSZip();
            var assiname = ($(".details .title,h4:eq(0)").text()).slice(1, $(".details .title,h4:eq(0)").text().length - 1)
            var total = 0;
            var fetched = 0;

            function add_total() {
                total = total + 1;
                $("#dropbox_dialog").text('downloading:' + fetched + '/' + total)
            }

            function add_fetched() {
                fetched = fetched + 1;
                if (fetched == total) {
                    $("#dropbox_dialog").text('We are making ZIP file...')
                    zip.generateAsync({
                        type: "blob"
                    }).then(content => {
                        saveAs(content, "" + assiname + ".zip")
                        $(".mdc-dialog").remove();
                    })
                } else {
                    $("#dropbox_dialog").text('downloading:' + fetched + '/' + total);
                }
            }

            function dropbox_details() {
                var details = $(".fix-body-margins.redactor-styles").text();
                add_total();
                zip.folder("").file("details.txt", details);
                add_fetched();
            }

            function dropbox_pictures() {
                if (!!$(".fix-body-margins > figure")) {
                    $(".fix-body-margins > figure >img").each(function (index) {
                        add_total();
                        var file_name = 'img' + index + '.png';
                        var url = $(this).attr("src")
                        fetch(url).then(response => response.blob()).then(function (data) {
                            zip.file(file_name, data, {
                                binary: true
                            })
                            add_fetched();
                        })
                    })
                }
            }

            function dropbox_attachments() {
                if (!!$("h3:contains(Attachments)")) {
                    $(".list-unstyled:eq(1) > li").each(function () {
                        add_total();
                        var file_name = $(this).find("a").text()
                        var url = $(this).find("a").attr("href")
                        fetch(url).then(response => response.blob()).then(function (data) {
                            zip.folder("Assignment").file(file_name, data, {
                                binary: true
                            })
                            add_fetched()
                        })
                    })
                }
            }

            function dropbox_dropbox() {
                if (!!$("h3:contains(Dropbox)")) {
                    $(".total-commander > div").each(function () {
                        add_total();
                        var attr = JSON.parse($(this).attr("data-ec3-info"))
                        var file_name = attr.name
                        var url = attr.download_url
                        fetch(url).then(response => response.blob()).then(function (data) {
                            zip.folder("Dropbox").file(file_name, data, {
                                binary: true
                            })
                            add_fetched()
                        })
                    })
                }
            }
            dropbox_pictures();
            dropbox_attachments();
            dropbox_dropbox();
            dropbox_details();
        })
    })


export const taskScoreUpload = new toolBox(

    [
        'classAssignmentList',
        'classAssignmentListOld'

    ],
    'taskScoreUpload',

    async function work(type) {
        //do something
        await import('/lib/localforage.min.js');
        var handler = await import('/core/eventHandler.js');
        var eventHandler = handler.default;

        function readAssignmentData() {
            var assignments = [];
            $(".line").each(function () {
                var $this = $(this);

                var due = new Date();
                var month = $this.find(".month").text().toLowerCase();
                due.setMonth("janfebmaraprmayjunjulaugsepoctnovdec".indexOf(month.toLowerCase()) / 3);
                due.setDate($this.find(".date").text().toLowerCase());

                var get = parseInt($this.find(".label-score")
                    .text()
                    .split(" / ", 2)[0]);
                var full = parseInt($this.find(".label-score")
                    .text()
                    .split(" / ", 2)[1]);
                var isSummative = $this.find(".labels-set > .label:first")
                    .text()
                    .toLowerCase() == "summative";

                assignments.push({
                    id: parseInt(
                        $this
                        .find("div.details > h4 > a")
                        .attr("href")
                        .slice(38)
                    ),
                    category: $this.find(".labels-set > .label:last").text(),
                    isSummative,
                    score: {
                        get,
                        full,
                        percentage: get / full
                    },
                    due,
                    valid: full ? isSummative : false
                });
            });
            return assignments;
        }
        var returnData = [];
        // console.log(readAssignmentDataThings)
        readAssignmentData().forEach(event => {

            // var item = await eventHandler.get(event.id);
            // console.log(event)
            if (event.score.full > 0) {
                returnData.push({
                    id: event.id,
                    get: event.score.get,
                    percentage: event.score.percentage,
                    total: event.score.full
                })
                // item.score.get = event.score.get;
                // item.score.total = event.score.full;
                // localforage.setItem(event.id, item);
            } else {

            }



        })
        console.log(returnData)
        chrome.runtime.sendMessage({
            "data": returnData,
            "method": "taskScoreUpload"
            // "additionData": {
            //     title: name
            // }
        });

    }
);

export const kondaEcon = new toolBox(

    [
        'classAssignmentList',
        'classAssignmentListOld'

    ],

    'kondaEcon',

    async function work(type) {
            //do something
            return true
        },

        async function cond(type) {
            //if classId is Konda's class, return true.
            return true
        }
)

export const managebakerPanel = new toolBox(

    [
        'dashboard',
        'classFiles'

    ],

    'managebakerPanel',

    async function work(type) {
            $('div.sidebar>section:last-child').append('<section id="managebaker-panel"><div class="panel-group collapsible panel-sidebar"><div class="panel panel-default"><div class="panel-heading"><svg xmlns="http://www.w3.org/2000/svg"viewBox="-29 31 40 40"enable-background="new -29 31 40 40"class="fu"><path fill="#859BBB"d="M-10.2 31h-11c-3.3 0-6.7 1.8-7.7 4v-.2 31.2c.4 2.8 3.7 5 7.7 5h32.2v-40h-21.2zm19.2 38h-30c-2.8 0-6-2.3-6-4s3.2-4 6-4h30v8zm-30-10c-2 0-4.6 1.1-6 2v-25c.3-1.3 3.3-2.9 6-3h30v26h-30zM-8.6 47.2c0 1.9-.5 3.3-1.5 4.3s-2.5 1.5-4.4 1.5h-3.2v-11.4h3.5c1.8 0 3.2.5 4.1 1.5s1.5 2.3 1.5 4.1zm-1.4.1c0-1.5-.4-2.6-1.1-3.4-.7-.8-1.9-1.1-3.3-1.1h-1.9v9.1h1.6c1.6 0 2.8-.4 3.6-1.2s1.1-1.9 1.1-3.4zM1.1 44.9c0 1.2-.4 2-1.2 2.7s-1.9.9-3.4.9h-1.3v4.5h-1.3v-11.4h3c2.8 0 4.2 1.1 4.2 3.3zm-5.9 2.5h1.2c1.2 0 2-.2 2.6-.6.5-.4.8-1 .8-1.8s-.2-1.3-.7-1.7c-.5-.4-1.3-.6-2.3-.6h-1.5v4.7z"></path></svg>Managebaker</div><div class="panel-body"><div class="content-block"><ul class="nav nav-pills nav-stacked nav-sc"><li><h4><svg baseProfile="full"xmlns="http://www.w3.org/2000/svg"width="34"height="40"viewBox="0 0 34 40"class="fu"><g fill-rule="evenodd"fill="#859BBB"><path d="M29.143 40H4.857C2.175 40 0 37.762 0 35V10c0-2.76 2.175-5 4.857-5H9V3h3c1.052-1.488 2.758-3 5-3s3.948 1.512 5 3h3v2h4.143C31.825 5 34 7.24 34 10v25c0 2.762-2.175 5-4.857 5zM23.07 5h-2.697c0-1.38-1.51-3-3.373-3-1.863 0-3.373 1.62-3.373 3H10.93v5h12.14V5zM32 10c0-1.38-1.66-3-3-3h-4v5H9V7H5c-1.34 0-3 1.62-3 3v25c0 1.38 1.66 3 3 3h24c1.34 0 3-1.62 3-3V10z"></path><path d="M26.622 20.173L14.98 31.627c-.235.23-.558.373-.914.373s-.68-.142-.912-.373l-5.776-5.684c-.234-.23-.378-.55-.378-.9 0-.703.578-1.273 1.29-1.273.357 0 .68.142.913.373l5.207 5.227 10.387-10.997c.234-.23.556-.373.913-.373.712 0 1.29.57 1.29 1.273 0 .352-.145.67-.378.9zM26.57 18z"></path></g></svg><a target="_blank"href="javascript:void(0)"id="managebaker-discussion">Discussion Forum</a></h4></li><li><h4><svg baseProfile="full"xmlns="http://www.w3.org/2000/svg"width="38"height="40"viewBox="0 0 38 40"class="fu"><g fill-rule="evenodd"fill="#859BBB"><path d="M34.546 40H3.454C1.547 40 0 38.476 0 36.596V6.956C0 5.077 2.092 3 4 3h3c0-1.41 1.57-3 3-3s3 1.59 3 3h3c0-1.41 1.57-3 3-3s3 1.59 3 3h3c0-1.41 1.57-3 3-3s3 1.59 3 3h3c1.908 0 4 2.077 4 3.957v29.64C38 38.476 36.454 40 34.546 40zM11 3c0-.47-.523-1-1-1s-1 .53-1 1v2c0 .47.523 1 1 1s1-.53 1-1V3zm9 0c0-.47-.523-1-1-1s-1 .53-1 1v2c0 .47.523 1.106 1 1.106S20 5.47 20 5V3zm9 0c0-.47-.523-1-1-1s-1 .53-1 1v2c0 .47.523 1 1 1s1-.53 1-1V3zm7 4c0-.94-1.046-2-2-2h-3c0 1.41-1.57 3-3 3s-2.954-1.334-2.954-2.744L22 5c0 1.41-1.57 2.81-3 2.81S16 6.41 16 5h-3c0 1.41-1.57 3-3 3S7 6.41 7 5H4c-.954 0-2 1.06-2 2v4h34V7zm0 6H2v23c0 .94 1.046 2 2 2h30c.954 0 2-1.06 2-2V13z"></path><path d="M27.128 29.885V33h-2.236v-3.115h-6.524v-1.768l6.524-9.433h2.236v9.296h1.924v1.905h-1.924zm-2.217-8.623c-.18.43-.467.95-.858 1.562l-3.545 5.156h4.385v-3.584c0-1.275.032-2.32.097-3.134h-.08zm-12.324 2.52c0-1.1.026-1.973.078-2.618-.15.156-.334.33-.552.518-.218.19-.95.787-2.192 1.797l-1.153-1.457 4.2-3.3h1.914V33h-2.294v-9.22z"></path></g></svg><a target="_blank"href="javascript:void(0)"id="managebaker-settings">Settings</a></h4></li><li><h4><svg xmlns="http://www.w3.org/2000/svg"width="50"height="50"viewBox="0 0 100 100"class="fu"><path fill="#acf"fill-rule="evenodd"d="M90 85H75v-5h14c2.4 0 6-3.6 6-6V30H80c-4.8 0-10-5.2-10-10V5H41c-2.4 0-6 2.6-6 5h-5c0-4.8 5.2-10 10-10h36l24 24v49c0 4.8-5.2 12-10 12zM75 6v13c0 2.4 3.6 6 6 6h13zm-29 9l24 24v51c0 4.8-5.2 10-10 10H10c-4.8 0-10-5.2-10-10V25c0-4.8 5.2-10 10-10h36zm-1 6v13c0 2.4 3.6 6 6 6h13zM5 26v63c0 2.4 3.6 6 6 6h48c2.4 0 6-3.6 6-6V45H50c-4.8 0-10-5.2-10-10V20H11c-2.4 0-6 3.6-6 6zm10 24h20v5H15v-5zm0-15h20v5H15v-5zm40 35H15v-5h40v5zm0 15H15v-5h40v5z"></path></svg><a target="_blank"href="javascript:void(0)"id="managebaker-report">Report an Issue</a></h4></li></ul></div></div></div></div></section>')
            var panel = $('#managebaker-panel')
            $('#managebaker-discussion').on('click', () => {
                window.open("http://www.managebaker.com/discuss")
            })

            $('#managebaker-settings').on('click', () => {
                chrome.runtime.sendMessage({
                    method: "createurl",
                    url: "modules/options.html",
                    extension: 1
                });
            })
            $('#managebaker-report').on('click', () => {
                window.open("http://www.managebaker.com/discuss/t/bug-report")
            })

            // if (type == 'classFiles') {
            //     panel.find('li:first-child').before('<li><h4><svg xmlns="http://www.w3.org/2000/svg"width="50"height="50"viewBox="0 0 100 100"class="fu"><path fill="#acf"fill-rule="evenodd"d="M90 85H75v-5h14c2.4 0 6-3.6 6-6V30H80c-4.8 0-10-5.2-10-10V5H41c-2.4 0-6 2.6-6 5h-5c0-4.8 5.2-10 10-10h36l24 24v49c0 4.8-5.2 12-10 12zM75 6v13c0 2.4 3.6 6 6 6h13zm-29 9l24 24v51c0 4.8-5.2 10-10 10H10c-4.8 0-10-5.2-10-10V25c0-4.8 5.2-10 10-10h36zm-1 6v13c0 2.4 3.6 6 6 6h13zM5 26v63c0 2.4 3.6 6 6 6h48c2.4 0 6-3.6 6-6V45H50c-4.8 0-10-5.2-10-10V20H11c-2.4 0-6 3.6-6 6zm10 24h20v5H15v-5zm0-15h20v5H15v-5zm40 35H15v-5h40v5zm0 15H15v-5h40v5z"></path></svg><a target="_blank"href="javascript:void(0)"id="managebaker-download-all">Download All Files</a></h4></li>');

            // }

            return true
        },

        async function cond(type) {
            //if classId is Konda's class, return true.
            return true
        }
)

export const downloadFiles = new toolBox(
    [
        'classFiles'
    ],
    'downloadFiles',
    async function work(type) {
            await import('/lib/filesaver.js')
            await import('/lib/jszip.js')
            var $pig = $(".pagination")
            if ($pig.length) {
                console.log(1)
                $pig.find('li:last-child').after('<li id="managebaker-download-all"><a href="javascript:void(0)">download all</a></li>');
            } else {
                console.log(2)
                $('.total-commander').after('<ul class="pagination pagination"><li id="managebaker-download-all"><a href="javascript:void(0)">download all</a></li></ul>')
            }

            $("#managebaker-download-all").click(function () {
                $(document.body).append('<div class="mdc-dialog mdc-dialog--open" role="alertdialog" aria-modal="true" aria-describedby="alert-dialog-description"><div class="mdc-dialog__scrim"></div><div class="mdc-dialog__container"><div class="mdc-dialog__surface"><section id="alert-dialog-description" class="mdc-dialog__content"><p id="dropbox_dialog" style="font-size:20px"></p></section></div></div></div>')
                var zip = new JSZip();
                var className = $("div.content-block-header > h3").text();
                var total = 0;
                var fetched = 0;
                var root_path = '';

                function add_total() {
                    total = total + 1;
                    $("#dropbox_dialog").text('downloading:' + fetched + '/' + total)
                }

                function add_fetched() {
                    fetched = fetched + 1;
                    if (fetched == total) {
                        $("#dropbox_dialog").text('We are making ZIP file...')
                        zip.generateAsync({
                            type: "blob"
                        }).then(content => {
                            saveAs(content, "" + className + ".zip")
                            $(".mdc-dialog").remove();
                        })
                    } else {
                        $("#dropbox_dialog").text('downloading:' + fetched + '/' + total);
                    }
                }

                function download_details() {
                    // var details = $(".fix-body-margins.redactor-styles").text();
                    // add_total();
                    zip.folder("").file("details.txt", "details");
                    // add_fetched();
                }

                // function dropbox_pictures() {
                //     if (!!$(".fix-body-margins > figure")) {
                //         $(".fix-body-margins > figure >img").each(function (index) {
                //             add_total();
                //             var file_name = 'img' + index + '.png';
                //             var url = $(this).attr("src")
                //             fetch(url).then(response => response.blob()).then(function (data) {
                //                 zip.file(file_name, data, {
                //                     binary: true
                //                 })
                //                 add_fetched();
                //             })
                //         })
                //     }
                // }

                async function download_single(file_name, url, path) {
                    console.log([file_name, url, path])
                    add_total();
                    fetch(url).then(response => response.blob()).then(function (data) {
                        zip.folder(path).file(file_name, data, {
                            binary: true
                        })
                        // await sleep(200);
                        add_fetched()
                    })

                    console.log('download ' + url + ' at ' + path)
                }

                function download_folder(name, document, base_path) {
                    console.log([name, document, base_path])
                    var this_path = base_path + '/' + name

                    if (!!$(document).find(".row.header")) {

                        //handle new folders
                        var $1 = $(document).find(".total-commander > .file > div > a");
                        if ($1.length) {
                            console.log('folder found!')
                            console.log($1)
                            $1.each(function () {
                                var next_name = $(this).text().trim();
                                var next_url = $(this).attr('href');

                                // console.log([next_name, next_url]);

                                fetch(next_url)
                                    .then(data => {
                                        console.log(data);
                                        return data.text()
                                    })
                                    .then(data => download_folder(next_name, data, this_path));


                            });
                        }

                        //handle files
                        var $2 = $(document).find('#assets>div');
                        if ($2.length) {
                            $2.each(function () {
                                // add_total();
                                var file_data = JSON.parse($(this).attr('data-ec3-info'));

                                var file_name = file_data.name;
                                var url = file_data.download_url;

                                download_single(file_name, url, this_path)

                            })
                        }

                        //handle all pages
                        var $3 = $(document).find('li.next:not(.disabled) a');
                        if ($3.length) {

                            var next_url = $3.attr('href');
                            console.log([next_url]);
                            fetch(next_url)
                                .then(data => {
                                    console.log(data);
                                    return data.text();
                                })
                                .then(data => {
                                    download_folder(name, data, base_path);
                                });

                        }

                    }

                }
                download_folder('files', document, root_path);
                download_details();
            })



            return true
        },

        async function cond(type) {
            //if classId is Konda's class, return true.
            return true
        }
)

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}