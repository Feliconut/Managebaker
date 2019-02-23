import {
    handler
} from "./prototypes";

import {
    addUtilitiesTab,
    addCheckbox,

} from "./toolbox"

export const globalPage = new handler(
    'globalPage',
    [addUtilitiesTab, addCheckbox]
)

export const assignmentList = new globalPage(
    'assignmentList',
    [addGradeChart]
)

export const assignmentSingle = new globalPage(
    'assignmentSingle',
    []
)

export const assignmentList = new globalPage(
    'assignmentList',
    [addGradeChart]
)