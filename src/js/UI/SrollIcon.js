import { gsap, Power3 } from 'gsap'

export default class ScrollIcon {

    visible = true

    constructor(icon) {
        this.icon = icon

        this.startAnimation()
    }

    startAnimation() {
        gsap.fromTo(this.icon, { y: 0 }, { y: 15, duration: 1, ease: Power3.easeIn, repeat: -1, yoyo: true })
    }

    hide() {
        if (this.visible) {
            this.visible = false

            gsap.to(this.icon, { opacity: 0, duration: .3 })

            setTimeout(() => {
                gsap.killTweensOf(this.icon)
                this.icon.classList.add('hide')
            }, 300)
        }
    }
}