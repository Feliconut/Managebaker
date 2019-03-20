import {
    toolBox,
} from "./prototypes.js";
import {
    DOIT
} from './assignment.js';
import eventHandler from "../core/eventHandler.js";



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
            '<li id="utilTab1" class="parent utilities"><a><svg baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="100 0 560 600" preserveAspectRatio="xMinYMin meet"><path fill-rule="evenodd" fill="#859BBB" d="' +
            pathString +
            '"></path></svg>Utilities</a><ul id="utilTab2" class="nav" data-max-height="129px" style="max-height: 0px;"><li><a href="/student/profile">My Profile </a></li><li><a href="https://accounts.managebac.cn/">Launchpad </a></li><li><a href="/help">Help &amp; Support </a></li><li id="utilTab3"><a id="utilTab3" href="/logout">Logout </a></li></ul></li>'
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

    function work(type) {
        //do something
        var mbChart = $(".assignments-progress-chart");
        if (mbChart.length) {
            DOIT();
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


// export const eventLoad = new toolBox(

//     [
//         'global'
//     ],
//     'eventUpdater',

//     async function work(type) {
//         //     //do something
//         $(".line").addClass("mdc-list-item");

//         var all_Events = []

//         //get event id for all events
//         $(".line").each(function () {
//             //get event id
//             var string;
//             console.log(type)
//             if (type.indexOf('Single') > -1) {
//                 string = window.location.pathname;
//             } else {
//                 string = $(this).find("a").attr("href");
//             }
//             var event_id = string.slice(string.length - 8, string.length);
//             all_Events.push(event_id)
//         });

//         //send sig


//if

//     getJobTemplate = async (eventId) => {
//         result = await eventHandler.get(evnetId)
//         if (result) {

//         }
//     }


//     all_Events.forEach(evnetid => {
//         all_jobs.push(getJobTemplate(eventId))
//     })
//     await Promise.all(all_Events);



//     if (all_Events.length) {
//         await eventHandler.run(eventHandler.mode.ROLLING_UPDATE)
//         all_Events.forEach(evnetid => {
//             all_jobs.push(getJobTemplate(eventId))
//         })
//         await Promise.all(all_Events);

//     }


// }
// );






export const normalInitGroup = [addUtilitiesTab]
export const DownlaodAsZip = new toolBox(

    [
        'classAssignmentSingle'
    ],
    'DownlaodAsZip',

    function work(type) {
        //CORS 失败



        //do something
        /*
           import('/lib/filesaver.js')
           import('/lib/vue.js')
           import('/lib/jszip.js').then(function () {
               var attachment = !!$("h3:contains(Attachments)");
               var dropbox = !!$("h3:contains(Dropbox)");
               console.log(attachment, dropbox)
               $(".mdc-checkbox").before('<div id="jszipdownload" style="padding: 11px;height: 46px;margin-left:auto !important;float:right;margin-right: 0px !important;margin-top: auto !important;margin-bottom: auto !important;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15l-5-5h3V9h4v4h3l-5 5z"/></svg></div>');
               $("#jszipdownload").click(function () {
                   var zip = new JSZip();
                   var assiname = ($(".details .title,h4:eq(0)").text()).slice(1, $(".details .title,h4:eq(0)").text().length - 1)
                   var details = $(".fix-body-margins.redactor-styles").text()
                   zip.file("details.txt", details);
                   var array = new Array();

                   if (!!$("h3:contains(Attachments)")) {
                       $(".list-unstyled:eq(1) > li").each(async function () {
                           var file_name = $(this).find("a").text()
                           var url = $(this).find("a").attr("href")
                           array.push(url)
                           var data = $.get(url)
                           zip.file(file_name,data , {
                               binary: true
                           }) // 逐个添加文件
                       })
                   }





                   zip.generateAsync({
                       type: "blob"
                   }).then(content => { // 生成二进制流
                       saveAs(content, "" + assiname + ".zip") // 利用file-saver保存文件
                   })

               })
           })
           */
    })