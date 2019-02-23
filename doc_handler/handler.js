/*
定义每一个handler

handler和toolbox定义见prototypes.js
*/
import {
    handler
} from "./prototypes.js";

import {
    addUtilitiesTab,
    addCheckbox,
    addGradeChart

} from "./toolbox.js";

const globalPage = new handler(
    'globalPage',
    [addUtilitiesTab]
);

const dashboard = new handler(
    'dashboard',
    [addUtilitiesTab, addCheckbox]
);

const assignmentList = new handler(
    'assignmentList',
    [addUtilitiesTab, addCheckbox, addGradeChart]
);

const assignmentSingle = new handler(
    'assignmentSingle',
    [addUtilitiesTab, addCheckbox]
);

export {
    globalPage,
    assignmentList,
    assignmentSingle,
    dashboard
};