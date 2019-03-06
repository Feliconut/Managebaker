export const pageType = {
    global: 'pageType_global',
    dashboard: 'pageType_dashboard',
    assignmentList: 'pageType_assignmentList',
    assignmentSingle: 'pageType_assignmentSingle',
    others: 'pageType_others'
}


/*
一个toolbox包装了对页面的一个特定操作。
*/
export class toolBox extends Object {
    constructor(applyto = [], name = '', work = undefined) {
        super()
        this.applyto = applyto //允许使用该toolbox的页面类型字符串。
        this.name = name //该toolbox的显示名称，用于debug。
        this.work = work //函数，此toolbox的内容
    }
    //执行toolbox的入口，会先检验是否适用当前页面
    run(type) {
        if (this.applyto.indexOf(type) > -1 || this.applyto.indexOf(pageType.global) > -1) {
            this.work(type)
        } else {
            throw this.name + " can't be applied to " + type
        }
    }
    //待传入的功能函数
    work() {
        //do something
    }
}

/*
一个handler包装了一组toolbox，对应一类页面的处理策略。
handler类可以继承，会优先执行父handler的toolbox。

目前handler的继承实现还不能用。
*/
export class handler extends Object {
    constructor(assignedPage = '', toolboxes = []) {
        super()
        this.assignedPage = assignedPage
        this.toolboxes = toolboxes
        // alert(JSON.stringify(this))
    }
    //执行handler的入口。
    run(type) {
        if (this.fuckreq(type)) {
            this.work(type)
            return 1
        } else {
            throw "error running handler"
        }
    }
    //递归执行，优先执行父handler的功能。
    fuckreq(type) {
        if (!this.prototype == undefined) {
            if (this.prototype.hasOwnProperty('work')) {
                this.prototype.run(type)
            }
        }
        return 1
    }
    //依序执行每一个toolbox。
    work(type) {
        //do something
        this.toolboxes.forEach(toolbox => {
            toolbox.run(type)
        });

    }
}