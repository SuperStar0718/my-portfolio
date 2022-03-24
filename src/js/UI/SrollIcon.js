import { gsap, Power3 } from 'gsap'
import Experience from '../Experience'

export default class ScrollIcon {

    visible = true

    constructor(icon, scrollContainerIcon) {
        this.icon = icon
        this.experience = new Experience()
        this.gestures = this.experience.gestures

        this.startAnimation()

        if (scrollContainerIcon)
            this.icon.style.opacity = 0
    }

    startAnimation() {
        gsap.fromTo(this.icon, { y: 0 }, { y: 15, duration: 1, ease: Power3.easeIn, repeat: -1, yoyo: true })
    }

    fade(visible) {
        if (this.visible)
            gsap.to(this.icon, { opacity: visible ? 1 : 0, duration: .3 })
    }

    kill() {
        if (this.visible) {
            this.fade()

            this.visible = false

            setTimeout(() => {
                gsap.killTweensOf(this.icon)
                this.icon.classList.add('hide')
            }, 300)
        }
    }
}