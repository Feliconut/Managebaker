/*
定义每一个handler

handler和toolbox定义见prototypes.js
*/
import {
    handler,
    pageType
} from "./prototypes.js";

import {
    addUtilitiesTab,
    addCheckbox,
    addGradeChart,
    Dropbox

} from "./toolbox.js";

const pageHandler = {

    process: (type) => {
        for (let handIdx = 0; handIdx < pageHandler.handlers.length; handIdx++) {
            const hand = pageHandler.handlers[handIdx];

            if (hand.assignedPage == type) {
                hand.run(type);
            }
        }
    },

    handlers: [

        new handler(
            pageType.global,
            [addUtilitiesTab]
        ),

        new handler(
            pageType.dashboard,
            [addUtilitiesTab, addCheckbox]
        ),

        new handler(
            pageType.assignmentList,
            [addUtilitiesTab, addCheckbox, addGradeChart]
        ),

        new handler(
            pageType.assignmentSingle,
            [addUtilitiesTab, addCheckbox, Dropbox]
        ),
        new handler(
            pageType.ibEventSingle,
            [addUtilitiesTab, addCheckbox]
        )
    ]
};
export {
    pageHandler
};