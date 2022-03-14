import { gsap, Back } from 'gsap'
import Experience from '../Experience'

export default class Transition {

    isShowing = false
    duration = .7

    domElements = {
        container: document.getElementById('transition-container'),
        logo: document.getElementById('loadig-animation-container'),
    }

    constructor() {
        this.experience = new Experience()
        this.resoureces = this.experience.resources

        this.hideIntro()
    }

    hideIntro() {
        setTimeout(() => {
            gsap.to(this.domElements.logo, { scale: 0, duration: .6, ease: Back.easeIn.config(1.7) })

            this.domElements.container.classList.add('hideIntroTransition')
        }, 300)
    }

    show() {

        //Prevent actions while open
        this.isShowing = true

        this.domElements.container.classList.remove('hideTopTransition')
        this.domElements.container.classList.remove('hideIntroTransition')
        this.domElements.container.classList.add('showTransition')
    }

    hide() {
        setTimeout(() => {
            this.domElements.container.classList.remove('showTransition')
            this.domElements.container.classList.add('hideTopTransition')

            //allow actions agains
            setTimeout(() => {
                this.isShowing = false
            }, this.duration * 1000)
        }, 150)
    }
}