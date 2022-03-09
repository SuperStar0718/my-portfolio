import Experience from '../Experience'
import { gsap } from 'gsap'

export default class ScrollBar {

    domElements = {
        scrollBar: document.getElementById('scroll-bar'),
        scrollContainer: document.getElementById('scroll-container')
    }

    constructor() {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll
        this.landingPage = this.experience.ui.landingPage
        this.gestures = this.experience.gestures

        this.gestures.on('scroll', () => setTimeout(() => this.updatePosition()))

        this.setHeight()
    }

    updatePosition() {
        if (!this.landingPage.visible) {
            const position = this.scroll.contentScrollTo + (window.innerHeight * (this.scroll.contentScrollTo / (this.domElements.scrollContainer.clientHeight)))
            gsap.to(this.domElements.scrollBar, { y: position, duration: this.scroll.parameters.scrollDuration })
        }
    }

    setHeight() {
        this.domElements.scrollBar.style.height = window.innerHeight * (window.innerHeight / this.domElements.scrollContainer.clientHeight) + 'px'
    }

    resize() {
        this.setHeight()
    }
} 