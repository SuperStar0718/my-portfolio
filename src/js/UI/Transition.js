import { gsap, Back } from 'gsap'
import Experience from '../Experience'

export default class Transition {

    container = document.getElementById('transition-container')
    logo = document.getElementById('loadig-animation-container')

    constructor() {
        this.experience = new Experience()
        this.resoureces = this.experience.resources

        this.hideIntro()
    }

    hideIntro() {
        setTimeout(() => {
            gsap.to(this.logo, { scale: 0, duration: .6, ease: Back.easeIn.config(1.7) })

            setTimeout(() => this.container.classList.add('hideTransition'), 150)
        }, 300)
    }
}