import { gsap, Back } from 'gsap'
import Experience from '../Experience'

export default class Transition {

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

            this.hide()
        }, 300)
    }
    
    hide() {
        this.domElements.container.classList.remove('showTransition')
        this.domElements.container.classList.add('hideTransition')
    }

    show() {
        this.domElements.container.classList.remove('hideTransition')
        this.domElements.container.classList.add('showTransition')
    }
}