import Experience from '../Experience'
import { gsap, Power2 } from 'gsap'

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

        this.gestures.on('scroll', () => setTimeout(() => this.updatePosition(), 0))

        this.setHeight()
    }

    updatePosition() {
        if (!this.landingPage.visible) {
            const scrollPercentage = this.scroll.contentScrollTo / (this.domElements.scrollContainer.clientHeight - window.innerHeight)
            const position = this.scroll.contentScrollTo + (window.innerHeight * (this.scroll.contentScrollTo / (this.domElements.scrollContainer.clientHeight)))
            gsap.to(this.domElements.scrollBar, { y: position + (this.height * scrollPercentage), duration: this.scroll.parameters.scrollDuration, ease: Power2.easeOut })
        }
    }

    setHeight() {
        this.height = (window.innerHeight * (window.innerHeight / this.domElements.scrollContainer.clientHeight)) * 0.5
        this.domElements.scrollBar.style.height = this.height + 'px'
    }

    resize() {
        this.setHeight()
    }
} 