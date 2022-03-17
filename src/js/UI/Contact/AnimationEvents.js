import Experience from "../../Experience";

export default class ContactAnimationEvents {
    constructor() {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll
        this.sections = this.experience.ui.sections
        this.animation = this.experience.world.contact.animation

        this.addScrollEvents()
    }

    addScrollEvents() {
        this.scroll.addEvent(this.sections.sections[2].y - (window.innerHeight / 2), 'down', () => this.animation.playTransition())
        this.scroll.addEvent(this.sections.sections[2].y - window.innerHeight, 'down', () => this.animation.playIdle())
    }

    resize() {
        this.addScrollEvents()
    }
}