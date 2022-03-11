import Experience from "../Experience"
import { gsap } from 'gsap'

export default class Sound {

    active = true

    parameters = {
        activeColor: '#FF923E',
        deactiveColor: '#a7adb8',
    }

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
        localStorage.getItem('soundActive') === 'true' || localStorage.getItem('soundActive') === true ? this.activate() : this.deactivate()
        this.sounds.mute(!this.active)

        //Event Listener
        this.domElements.button.addEventListener('click', () => {
            this.active ? this.deactivate() : this.activate()
        })

        // M Key
        window.addEventListener('keydown', () => {
            if (event.key === 'm') {
                this.active ? this.deactivate() : this.activate()
            }
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
        this.domElements.button.style.background = this.parameters.deactiveColor

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
        this.domElements.button.style.background = this.parameters.activeColor

        this.updateLocalStorage()
    }

    updateLocalStorage() {
        localStorage.setItem('soundActive', this.active)
    }
}