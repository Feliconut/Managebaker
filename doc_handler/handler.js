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
<<<<<<< HEAD
    ClassColor,
=======
>>>>>>> master
    Dropbox,
    normalInitGroup,
    DownlaodAsZip,
    taskScoreUpload,
<<<<<<< HEAD
    managebakerPanel,
    downloadFiles,
    kondaEcon
=======
    managebakerPanel
>>>>>>> master
} from "./toolbox.js";

const pageHandler = {

    process: (url) => {
<<<<<<< HEAD
=======
        console.log(url)
>>>>>>> master

        for (let handIdx = 0; handIdx < pageHandler.handlers.length; handIdx++) {
            const hand = pageHandler.handlers[handIdx];

            if (hand.run(url)) {
                return 1;
            }
        }
<<<<<<< HEAD
        console.log('pageHandler executed no handler');
=======
        console.log('pageHandler executed no handler')
>>>>>>> master
        return 0;
    },

    handlers: [

        new pageType(
            'dashboard',
            new RegExp("student/?$"),
<<<<<<< HEAD
            [addUtilitiesTab, addCheckbox, ClassColor, managebakerPanel]
=======
            [addUtilitiesTab, addCheckbox,managebakerPanel]
>>>>>>> master
        ),
        new pageType(
            'classOverview',
            new RegExp("student/classes/[0-9]+/?$"),
<<<<<<< HEAD
            [addUtilitiesTab, addCheckbox, ClassColor,]
=======
            [addUtilitiesTab, addCheckbox]
>>>>>>> master
        ),
        new pageType(
            'classAssignmentList',
            new RegExp("student/classes/[0-9]+/assignments/?$"),
<<<<<<< HEAD
            [addUtilitiesTab, addCheckbox, ClassColor, taskScoreUpload, addGradeChart, kondaEcon]
=======
            [addUtilitiesTab, addCheckbox, taskScoreUpload, addGradeChart]
>>>>>>> master
        ),
        new pageType(
            'classAssignmentSingle',
            new RegExp("student/classes/[0-9]+/assignments/[0-9]+/?$"),
<<<<<<< HEAD
            [addUtilitiesTab, addCheckbox, ClassColor, /*Dropbox,*/ DownlaodAsZip]
=======
            [addUtilitiesTab, addCheckbox, /*Dropbox,*/ DownlaodAsZip]
>>>>>>> master
        ),
        new pageType(
            'classAssignmentListOld',
            new RegExp("student/classes/[0-9]+/assignments"),
<<<<<<< HEAD
            [addUtilitiesTab, addCheckbox, ClassColor, taskScoreUpload, addGradeChart]
=======
            [addUtilitiesTab, addCheckbox, taskScoreUpload, addGradeChart]
>>>>>>> master
        ),
        new pageType(
            'classEventSingle',
            new RegExp("student/classes/[0-9]+/events/[0-9]+/?$"),
<<<<<<< HEAD
            [addUtilitiesTab, addCheckbox, ClassColor,]
=======
            [addUtilitiesTab, addCheckbox]
>>>>>>> master
        ),
        new pageType(
            'ibEventSingle',
            new RegExp("student/ib/events/[0-9]+/?$"),
<<<<<<< HEAD
            [addUtilitiesTab, addCheckbox, ClassColor,]
        ),
        new pageType(
            'classFiles',
            new RegExp("student/classes/[0-9]+/files"),
            [addUtilitiesTab, ClassColor,]
=======
            [addUtilitiesTab, addCheckbox]
>>>>>>> master
        ),
        new pageType(
            "global",
            new RegExp('student'),
<<<<<<< HEAD
            [addUtilitiesTab, ClassColor,]
=======
            [addUtilitiesTab]
>>>>>>> master
        )
    ]
};
export {
    pageHandler
};