export class handler extends Object {
    constructor(name = '', toolboxes = []) {
        this.name = name
        this.toolboxes = []

        this.constructor = this.prototype.constructor
    }
    static run(type) {
        if (this.fuckreq(type)) {
            this.work(type)
            return 1
        } else {
            throw "error running handler"
        }
    }

    //这是一个递归，直到原型链最上面也就是handler定义
    static fuckreq(type) {
        if (this.prototype.hasOwnProperty('mywork')) {
            this.prototype.run(type)
        }
        return 1
    }


    work(type) {
        //do something
        toolboxes.forEach(toolbox => {
            toolbox.run(type)
        });

    }
}


export class toolBox extends Object {
    constructor(applyto = [], name = '', work) {
        this.applyto = applyto
        this.name = name
        this.work = work
    }
    static run(type) {
        if (this.applyto.indexOf(type) > -1 || this.applyto.indexOf('global')) {
            this.work(type)
        } else {
            throw this.name + " can't be applied to " + type
        }
    }


}

export class toolBoxTemplate extends toolBox {
    constructor() {
        super(['list'],
            'name')
    }
    work(type) {
        //do something
    }
}