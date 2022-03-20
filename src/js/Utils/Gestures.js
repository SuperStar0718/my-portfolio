import EventEmitter from '../Utils/EventEmitter.js'

export default class Gestures extends EventEmitter {

    constructor() {
        super()
    }

    init() {
        this.applyEventListeners()
        this.defineCurrentHoverElement()
    }

    applyEventListeners() {
        // bind (this) to event to prevent overwriting 
        this.mousewheelOrKey = this.mousewheelOrKey.bind(this)
        this.touchStart = this.touchStart.bind(this)
        this.touchEnd = this.touchEnd.bind(this)

        // event listeners 
        document.addEventListener('touchstart', this.touchStart)
        document.addEventListener('touchend', this.touchEnd)
        document.addEventListener('mousewheel', this.mousewheelOrKey)
        document.addEventListener('wheel', this.mousewheelOrKey)
        window.addEventListener('keyup', this.mousewheelOrKey)
    }

    //Current Hover Element
    defineCurrentHoverElement() {
        window.addEventListener('mouseover', () => {
            if (event.path) {
                this.currentHoveringElement = event.path[0]
            }
        })
    }

    //scroll down and up
    mousewheelOrKey() {
        if (event.deltaY > 0 || event.keyCode == 40) {
            this.trigger('scroll')
            this.trigger('scroll-down')
        } else if (event.deltaY < 0 || event.keyCode == 38) {
            this.trigger('scroll')
            this.trigger('scroll-up')
        }
    }

    //Touch
    touchStart() {
        this.mTouchStartY = event.changedTouches[0].clientY
        this.mTouchEndY = 0

        this.mTouchStartX = event.changedTouches[0].clientX
        this.mTouchEndX = 0
    }

    //Swipe gesutres -> left, right, top, bottom
    touchEnd() {
        this.mTouchEndY = event.changedTouches[0].clientY
        this.mTouchEndX = event.changedTouches[0].clientX

        this.touchDistanceY = this.mTouchEndY - this.mTouchStartY
        this.touchDistanceX = this.mTouchEndX - this.mTouchStartX

        const minimumTouchDistance = 50

        if (this.touchDistanceY < -minimumTouchDistance || this.touchDistanceY > minimumTouchDistance) {
            if (this.mTouchEndY < this.mTouchStartY) {
                this.trigger('touch-down')
            } else if (this.mTouchEndY > this.mTouchStartY) {
                this.trigger('touch-up')
            }
        }


        //check if minimum is reached for left and right
        if (this.touchDistanceX < -minimumTouchDistance || this.touchDistanceX > minimumTouchDistance) {
            //Check if scroll right or left
            if (this.mTouchEndX < this.mTouchStartX) {
                this.trigger('swipe-right')
            } else if (this.mTouchEndX > this.mTouchStartX) {
                this.trigger('swipe-left')
            }
        }
    }
}