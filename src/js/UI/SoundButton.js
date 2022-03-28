import Experience from "../Experience"
import { gsap, Linear, Power4 } from 'gsap'

export default class Sound {

    active = false

    domElements = {
        body: document.getElementById('sound-body-path'),
        volume0: document.getElementById('sound-volume-0-path'),
        volume1: document.getElementById('sound-volume-1-path'),
        button: document.getElementById('sound-button')
    }

    constructor() {
        this.experience = new Experience()
        this.sounds = this.experience.sounds
        this.landingPage = this.experience.ui.landingPage

        //Init
        this.deactivate()
        this.startAnimation()

        //Event Listener
        this.domElements.button.addEventListener('click', () => this.active ? this.deactivate() : this.activate())

        this.domElements.button.addEventListener('mouseenter', () => this.killAnimation())

        // M Key
        window.addEventListener('keydown', () => {
            if (event.key === 'm') {
                this.active ? this.deactivate() : this.activate()
            }
        })
    }

    startAnimation() {
        this.animationElements = document.querySelectorAll('.sound-button-animation')
        for (let i = 0; i < this.animationElements.length; i++) {
            gsap.fromTo(this.animationElements[i], { scale: 1 }, { scale: 2, repeat: -1, duration: 1, repeatDelay: .7, delay: i / 2, ease: Linear.easeNone })
            gsap.fromTo(this.animationElements[i], { opacity: .175 }, { opacity: 0, repeat: -1, duration: 1, repeatDelay: .7, delay: i / 2, ease: Power4.easeIn })
        }
    }

    killAnimation() {
        this.animationElements.forEach((element) => {
            gsap.killTweensOf(element)
            gsap.to(element, {opacity: 0, duration: .1})
            gsap.to(element, {scale: 0, duration: 0, delay: .1})
        })
    }

    deactivate() {
        this.active = false

        this.sounds.mute(true)

        //Icon
        gsap.to(this.domElements.body, { x: 2, duration: .2 })
        gsap.to(this.domElements.volume0, { opacity: 0, duration: 0 })
        gsap.to(this.domElements.volume1, { opacity: 0, duration: 0 })

        //Background
        this.domElements.button.classList.add('gray-hover')
        this.domElements.button.classList.remove('orange-hover')

        this.sounds.muteGroup((this.landingPage.visible ? 'lab' : 'landing'), true, 0)
        this.sounds.muteGroup((!this.landingPage.visible ? 'lab' : 'landing'), false, 0)
    }

    activate() {
        this.active = true
        this.sounds.mute(false)

        //Icon
        gsap.to(this.domElements.body, { x: 0, duration: .2 })
        gsap.to(this.domElements.volume0, { opacity: 1, duration: 0 })
        gsap.to(this.domElements.volume1, { opacity: 1, duration: 0, delay: .1 })

        //Background
        this.domElements.button.classList.remove('gray-hover')
        this.domElements.button.classList.add('orange-hover')

        if (!this.landingPage.visible) this.sounds.labAmbienceScroll('recent')
    }
}