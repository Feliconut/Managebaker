/*!
 * Managebaker
 * https://padlet.com/xyliu_felix/6h9wckhmchnp
 * Version: 3.1.1
 *
 * Copyright 2018 Managebaker Contributors
 * Released under the Apache license
 * https://github.com/Feliconut/Managebaker/blob/master/LICENSE
 */

//Content Script in all managebac domain
/*PSEUCODE:

import assignment,dash1board

Event locationChange:
    if location == Assignment:
        assignmentProcess()
    if location == Dashboard:
        dashboardProcess()

Event error:
    refresh()
*/

//我现在去上课了， document.ready是只有刚植入content script会触发 。这里的是需要
//让他在植入之后一直循环检测，或者找一个url change 的event来trigger整个function
//知道了
//我把电脑一直开着放在我背包后面，网络应该是不会断的。希望你这不会被影响吧XD 几小时后见

//现在不使用document ready
//manifest.json 新增background 通过active domains 和判断url中是否有student 和assignment进行。
//暂且用alert 代替，需要call functions
