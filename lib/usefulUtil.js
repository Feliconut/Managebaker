// Function to convert rgb format to a hex color
function rgb2hex(orig) {
    var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
}
// Function to convert hex format to a rgb color
function hex2rgba(hex, alpha) {
    var c;
    alpha = alpha || 1;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha.toString() + ')';
    }
    throw new Error('Bad Hex');
}

//日期的前后推
Date.prototype.Add = function (number, interval = 'd') {
    if (typeof number != 'number') {
        throw 'wrongType_number'
    }
    switch (interval) {
        case 'y':
            {
                this.setFullYear(this.getFullYear() + number);
                break
            }
        case 'q':
            {
                this.setMonth(this.getMonth() + number * 3);
                break
            }
        case 'M':
            {
                this.setMonth(this.getMonth() + number);
                break
            }
        case 'w':
            {
                this.setDate(this.getDate() + number * 7);
                break
            }
        case 'd':
            {
                this.setDate(this.getDate() + number);
                break
            }
        case 'h':
            {
                this.setHours(this.getHours() + number);
                break
            }
        case 'm':
            {
                this.setMinutes(this.getMinutes() + number);
                break
            }
        case 's':
            {
                this.setSeconds(this.getSeconds() + number);
                break
            }
        default:
            {

                throw 'invalidInterval'
            }

    }
    return this
};

//格式化日期
//http://caibaojian.com/javascript-this-format.html
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
// (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( 'd', 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
Date.prototype.Format = function (fmt) {
    //author: meizz
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
            );
    return fmt;
};