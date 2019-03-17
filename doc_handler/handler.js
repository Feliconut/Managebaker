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
    Dropbox,
    normalInitGroup,

} from "./toolbox.js";

const pageHandler = {

    process: (url) => {
        console.log(url)

        for (let handIdx = 0; handIdx < pageHandler.handlers.length; handIdx++) {
            const hand = pageHandler.handlers[handIdx];

            if (hand.run(url)) {
                return 1;
            }
        }
        console.log('pageHandler executed no handler')
        return 0;
    },

    handlers: [

        new pageType(
            'dashboard',
            new RegExp("student/?$"),
            [addUtilitiesTab, addCheckbox]
        ),
        new pageType(
            'classOverview',
            new RegExp("student/classes/[0-9]+/?$"),
            [addUtilitiesTab, addCheckbox]
        ),
        new pageType(
            'classAssignmentList',
            new RegExp("student/classes/[0-9]+/assignments/?$"),
            [addUtilitiesTab, addCheckbox, addGradeChart]
        ),
        new pageType(
            'classAssignmentSingle',
            new RegExp("student/classes/[0-9]+/assignments/[0-9]+/?$"),
            [addUtilitiesTab, addCheckbox, Dropbox]
        ),
        new pageType(
            'classAssignmentListOld',
            new RegExp("student/classes/[0-9]+/assignments"),
            [addUtilitiesTab, addCheckbox, addGradeChart]
        ),
        new pageType(
            'classEventSingle',
            new RegExp("student/classes/[0-9]+/events/[0-9]+/?$"),
            [addUtilitiesTab, addCheckbox]
        ),
        new pageType(
            'ibEventSingle',
            new RegExp("student/ib/events/[0-9]+/?$"),
            [addUtilitiesTab, addCheckbox]
        ),
        new pageType(
            "global",
            new RegExp('student'),
            [addUtilitiesTab]
        )
    ]
};
export {
    pageHandler
};