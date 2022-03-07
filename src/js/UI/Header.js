import Experience from '../Experience'

export default class Header {

    visible = true

    domElements = {
        header: document.getElementById('header-container'),
    }

    constructor() {
        this.experience = new Experience()
        this.landingPage = this.experience.ui.landingPage
        this.menu = this.experience.ui.menu
        this.gestures = this.experience.gestures

        //Trigger Events
        this.gestures.on('scroll-up', () => this.show())
        this.gestures.on('scroll-down', () => this.hide())
    }

    show() {
        if (!this.visible) {
            this.visible = true

            this.domElements.header.style.top = '0'
        }
    }

    hide() {
        if (this.visible && !this.landingPage.isAnimating && !this.menu.isAnimating) {
            this.visible = false

            this.domElements.header.style.top = '-100px'
        }
    }
}