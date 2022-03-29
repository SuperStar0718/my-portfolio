import { gsap } from 'gsap'

export default class Transition {

    isShowing = false
    duration = .7

    domElements = {
        container: document.getElementById('transition-container'),
        logo: document.getElementById('loadig-animation-container'),
    }

    show() {
        this.domElements.container.classList.remove('hide')

        //Prevent actions while open
        this.isShowing = true

        this.domElements.container.classList.remove('hideTopTransition')
        this.domElements.container.classList.remove('hideIntroTransition')
        this.domElements.container.classList.add('showTransition')
    }

    hide() {
        gsap.delayedCall(.15, () => {
            this.domElements.container.classList.remove('showTransition')
            this.domElements.container.classList.add('hideTopTransition')

            //allow actions agains
            gsap.delayedCall(this.duration, () => this.isShowing = false)
        })
    }
}