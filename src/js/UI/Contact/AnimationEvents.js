import Experience from "../../Experience";

export default class ContactAnimationEvents {

    domElements = {
        scrollContainer: document.getElementById('scroll-container')
    }

    landscapeTriggers = {
        idle: () => this.domElements.scrollContainer.clientHeight - (window.innerHeight * 2),
        transition: () => this.domElements.scrollContainer.clientHeight - (window.innerHeight * 1.5),
    }

    portraitTriggers = {
        idle: () => this.domElements.scrollContainer.clientHeight - (window.innerHeight * 2),
        transition: () => this.domElements.scrollContainer.clientHeight - (window.innerHeight * 1.2),
    }

    constructor() {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll
        this.sections = this.experience.ui.sections
        this.animation = this.experience.world.contact.animation
        this.sizes = this.experience.sizes

        this.addScrollEvents()
    }

    addScrollEvents() {

        this.scroll.addEvent(this.sizes.portrait ? this.portraitTriggers.idle() : this.landscapeTriggers.idle(), 'down', () => {
            this.animation.playIdle()
        })

        //Play transition
        this.scroll.addEvent(this.sizes.portrait ? this.portraitTriggers.transition() : this.landscapeTriggers.transition(), 'down', () => {
            setTimeout(() => this.animation.playTransition(), 500)
        })
    }

    resize() {
        this.addScrollEvents()
    }
}