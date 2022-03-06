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

        //Init
        localStorage.getItem('soundActive') === 'true' || localStorage.getItem('soundActive') === true ? this.activate() : this.deactivate()

        //Event Listener
        this.domElements.button.addEventListener('click', () => {
            this.active ? this.deactivate() : this.activate()
        })
    }

    deactivate() {
        this.active = false

        //Icon
        gsap.to(this.domElements.body, { x: 2, duration: .2 })
        gsap.to(this.domElements.volume0, { opacity: 0, duration: 0 })
        gsap.to(this.domElements.volume1, { opacity: 0, duration: 0 })

        //Background
        this.domElements.button.style.background = this.parameters.deactiveColor

        this.updateLocalStorage()
    }

    activate() {
        this.active = true

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