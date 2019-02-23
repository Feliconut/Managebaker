export class handler extends Object {
    constructor() {
        this.applyto = []
        this.id = 'root'
    }
    static run(content) {
        if (this.checkreq()) {
            this.mywork()
            return 1
        } else {
            throw "error running handler"
        }
    }

    static checkreq() {
        if (this.prototype.hasOwnProperty('mywork')) {
            this.prototype.run()
        } else {
            return 1
        }
    }

    mywork() {}

    
}