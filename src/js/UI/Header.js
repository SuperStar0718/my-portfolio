import Experience from '../Experience'
import { gsap, Back } from 'gsap'

export default class Header {

    visible = true

    domElements = {
        header: document.getElementById('header-container'),
    }

    constructor() {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll

        this.scroll.on('wheel-up', () => this.show())
        this.scroll.on('wheel-down', () => this.hide())
    }

    show() {
        if (!this.visible) {
            this.visible = true

            this.domElements.header.style.top = '0'
        }
    }

    hide() {
        if (this.visible) {
            this.visible = false

            this.domElements.header.style.top = '-100px'
        }
    }
}