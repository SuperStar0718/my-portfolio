import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Sizes extends EventEmitter {

    touch = false
    portrait = false

    constructor() {
        super()

        this.experience = new Experience()
        this.debug = this.experience.debug

        // Setup
        this.checkTouchDevice()
        this.checkPortrait()

        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Resize event
        window.addEventListener('resize', () => {
            this.checkTouchDevice()
            this.checkPortrait()

            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })
    }

    checkPortrait() {
        const isPortrait = window.innerWidth / window.innerHeight <= 1.1

        if (isPortrait !== this.portrait) {
            this.portrait = isPortrait
            this.trigger(this.portrait ? 'portrait' : 'landscape')
        }
    }

    checkTouchDevice() {
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)

        if (isTouch != this.touch) {
            this.touch = isTouch

            this.trigger(this.touch ? 'touch' : 'no-touch')
        }
    }
}