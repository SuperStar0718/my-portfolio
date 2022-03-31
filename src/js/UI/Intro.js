import Experience from '../Experience'
import { gsap, Back } from 'gsap'

export default class Intro {

    parameters = {
        timeTillFinish: 1.2
    }

    domElements = {
        container: document.getElementById('intro-container'),
        overlay: document.getElementById('overlay-container'),
        landingPage: document.getElementById('landing-page'),
        logo: document.getElementById('loadig-animation-container'),
        scrollIcon: document.querySelector('.scroll-icon')
    }

    constructor() {
        this.experience = new Experience()
        this.room = this.experience.world.landingPage.room
        this.landingPage = this.experience.ui.landingPage
        this.gestures = this.experience.gestures
        this.character = this.experience.world.character

        //Play Intro
        gsap.delayedCall(1.2, () => this.playIntro())
    }

    onButtonClick() {
        this.domElements.button.addEventListener('click', () => {
            if (!this.buttonPressed) {
                this.playIntro()
                this.buttonPressed = true
            }
        })
    }

    playIntro() {
        this.domElements.container.style.backgroundColor = 'transparent'

        //Intro Container
        gsap.to(this.domElements.logo, { scale: 0, duration: .6, ease: Back.easeIn.config(2.5) })

        this.landingPage.playOpeningAnimation(.62)

        this.room.bounceIn(.45, true)
        
        this.character.animations.playIntroAnimation()

        this.finish()
    }

    //Show overlay and enable gestures
    finish() {
        gsap.fromTo(this.domElements.overlay, { opacity: 0 }, { opacity: 1, delay: this.parameters.timeTillFinish, duration: .8 })

        gsap.delayedCall(this.parameters.timeTillFinish + 0.1, () => {
            this.domElements.container.classList.add('hide')
            this.gestures.init()
        })
    }
}