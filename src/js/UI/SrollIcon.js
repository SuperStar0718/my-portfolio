import { gsap, Power3 } from 'gsap'

export default class ScrollIcon {

    domElements = {
        container: document.getElementById('landing-scroll-icon'),
        wheel: document.getElementById('landing-scroll-wheel')
    }

    constructor() {
        this.startAnimation()
    }

    startAnimation() {
        gsap.fromTo(this.domElements.wheel, { y: 0 }, { y: 5, duration: 1, ease: Power3.easeIn, repeat: -1, yoyo: true })
    }

    hide() {
        gsap.to(this.domElements.container, { opacity: 0, duration: .3 })

        setTimeout(() => gsap.killTweensOf(this.domElements.wheel), 300)
    }
}