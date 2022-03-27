import Experience from "../../Experience";

export default class ContactAnimationEvents {

    domElements = {
        scrollContainer: document.getElementById('scroll-container')
    }

    constructor() {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll
        this.sections = this.experience.ui.sections
        this.animation = this.experience.world.contact.animation

        this.addScrollEvents()
    }

    addScrollEvents() {
        this.scroll.addEvent(this.domElements.scrollContainer.clientHeight - (window.innerHeight * 2), 'down', () => {
            this.animation.playIdle()
        })

        //Play transition
        this.scroll.addEvent(this.domElements.scrollContainer.clientHeight - (window.innerHeight * 1.5), 'down', () => {
            setTimeout(() => this.animation.playTransition(), 500)
        })
    }

    resize() {
        this.addScrollEvents()
    }
}