import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.hiddenDelta = 0

        window.requestAnimationFrame(() => {
            this.tick()
        })

        document.addEventListener('visibilitychange', () => {
            if(document.hidden) {
                this.hiddenOn = this.current
            } else {
                this.hiddenDelta = Date.now() - this.hiddenOn
            }
        })
    }

    tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current

        if(this.hiddenDelta != 0) {
            this.delta -= this.hiddenDelta
            this.hiddenDelta = 0
        } 

        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}