/*!
 * Managebaker
 * https://padlet.com/xyliu_felix/Managebaker
 * Version: 3.1.1.1
 *
 * Copyright 2019 Managebaker Contributors
 * Released under the Apache license
 * https://github.com/Feliconut/Managebaker/blob/master/LICENSE
 */

/*PSEUCODE:

import jQuery.js, chart.js

readAssignmentData()
calculate()
generateChart()

Event category.click:
    disableCat()
    calculate()

Event chart.dblclick:
    refreshChart()
  
Event chart.click:
    randomMotion()
*/

/*DATA STRUCTURE:
===TABLE===
ASSIGNMENT_ID | JSON_DATA

===JSON_DATA===
{
  obj score{
    int full
    int get
  }
  Obj calc{
    double percentage
    boolean activate
  }
}
*/
