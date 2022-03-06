import { gsap, Power3 } from 'gsap'

export default class ScrollIcon {

    constructor(containerId, wheelId) {
        this.container = document.getElementById(containerId)
        this.wheel = document.getElementById(wheelId)

        this.startAnimation()
    }

    startAnimation() {
        gsap.fromTo(this.wheel, { y: 0 }, { y: 5, duration: 1, ease: Power3.easeIn, repeat: -1, yoyo: true })
    }

    hide() {
        gsap.to(this.container, { opacity: 0, duration: .3 })

        setTimeout(() => gsap.killTweensOf(this.wheel), 300)
    }
}