// export const pageType = {
//     global: 'pageType_global',
//     dashboard: 'pageType_dashboard',
//     assignmentList: 'pageType_assignmentList',
//     assignmentSingle: 'pageType_assignmentSingle',
//     ibEventSingle: 'pageType_ibEventSingle',
//     others: 'pageType_others'
// };

/*
一个toolbox包装了对页面的一个特定操作。
*/
export class toolBox extends Object {
    constructor(applyto = [], name = '', work = undefined, cond=()=>{return true;}) {
        super();
        this.applyto = applyto; //允许使用该toolbox的页面类型字符串。
        this.name = name; //该toolbox的显示名称，用于debug。
        this.work = work; //函数，此toolbox的内容
        this.cond = cond;
    }
    //执行toolbox的入口，会先检验是否适用当前页面
    run(type) {
        if (this.applyto.indexOf(type) > -1 || this.applyto.indexOf('global') > -1) {
            this.work(type);

        } else {
            throw this.name + " can't be applied to " + type;
        }
    }
    //待传入的功能函数
    work() {
        //do something
    }
    
    //额外执行条件
    cond(){

    }
}

// export class toolBoxBundle extends Object {
//     constructor(contains = []) {
//         super();
//         this.contains = contains;
//         contains.forEach(tbx => {
//             if (!toolBox.isPrototypeOf(tbx)) {
//                 throw 'toolBoxBundle Define Error'
//             }
//         });
//     }
//     getContain() {
//         name_array = []
//         contains.forEach(tbx => {
//             name_array.push(tbx.name);
//         })
//         return name_array;
//     }
//     run() {
//         contains.forEach(tbx => {
//             tbx.run();
//         })

//     }
// }


/*
一个handler包装了一组toolbox，对应一类页面的处理策略。
handler类可以继承，会优先执行父handler的toolbox。

目前handler的继承实现还不能用。
*/
export class pageType extends Object {
    constructor(pageName = '', RegEx = new RegExp(), toolboxes = []) {
        super();
        this.pageName = pageName;
        this.RegEx = RegEx;
        this.toolboxes = toolboxes;
    }
    //执行handler的入口。
    run(url) {
        if (this.RegEx.test(url)) {
            // alert('executed ' + this.pageName);
            this.work(this.pageName);
            return 1
        } else {
            return 0
        }
    }

    //依序执行每一个toolbox。
    work(type) {
        //do something
        var executed = [];
        this.toolboxes.forEach(thing => {
            if (!thing.hasOwnProperty('length')) {
                thing = [thing];
            }
            thing.forEach(tool => {
                if (executed.indexOf(tool.name) == -1) {
                    tool.run(type);
                    executed.push(tool.name)
                }
            });


        });
    }
}