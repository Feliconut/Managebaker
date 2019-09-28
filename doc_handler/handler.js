/*
定义每一个handler

handler和toolbox定义见prototypes.js
*/
import {
    pageType
} from "./prototypes.js";

import {
    addUtilitiesTab,
    addCheckbox,
    addGradeChart,
    ClassColor,
    Dropbox,
    normalInitGroup,
    DownlaodAsZip,
    taskScoreUpload,
    managebakerPanel,
    downloadFiles,
    kondaEcon
} from "./toolbox.js";

const pageHandler = {

    process: (url) => {

        for (let handIdx = 0; handIdx < pageHandler.handlers.length; handIdx++) {
            const hand = pageHandler.handlers[handIdx];

            if (hand.run(url)) {
                return 1;
            }
        }
        console.log('pageHandler executed no handler');
        return 0;
    },

    handlers: [

        new pageType(
            'dashboard',
            new RegExp("student/?$"),
            [addUtilitiesTab, addCheckbox, ClassColor, managebakerPanel]
        ),
        new pageType(
            'classOverview',
            new RegExp("student/classes/[0-9]+/?$"),
            [addUtilitiesTab, addCheckbox, ClassColor,]
        ),
        new pageType(
            'classAssignmentList',
            new RegExp("student/classes/[0-9]+/assignments/?$"),
            [addUtilitiesTab, addCheckbox, ClassColor, taskScoreUpload, addGradeChart, kondaEcon]
        ),
        new pageType(
            'classAssignmentSingle',
            new RegExp("student/classes/[0-9]+/assignments/[0-9]+/?$"),
            [addUtilitiesTab, addCheckbox, ClassColor, /*Dropbox,*/ DownlaodAsZip]
        ),
        new pageType(
            'classAssignmentListOld',
            new RegExp("student/classes/[0-9]+/assignments"),
            [addUtilitiesTab, addCheckbox, ClassColor, taskScoreUpload, addGradeChart]
        ),
        new pageType(
            'classEventSingle',
            new RegExp("student/classes/[0-9]+/events/[0-9]+/?$"),
            [addUtilitiesTab, addCheckbox, ClassColor,]
        ),
        new pageType(
            'ibEventSingle',
            new RegExp("student/ib/events/[0-9]+/?$"),
            [addUtilitiesTab, addCheckbox, ClassColor,]
        ),
        new pageType(
            'classFiles',
            new RegExp("student/classes/[0-9]+/files"),

            [addUtilitiesTab, ClassColor,]
        ),
        new pageType(
            "global",
            new RegExp('student'),
            [addUtilitiesTab, ClassColor,]
        )
    ]
};
export {
    pageHandler
};