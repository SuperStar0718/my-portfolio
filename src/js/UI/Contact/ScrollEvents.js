import Experience from "../../Experience"
import { gsap } from 'gsap'

export default class ContactAnimationEvents {

    domElements = {
        scrollContainer: document.getElementById('scroll-container'),
        smallHeader: document.querySelectorAll('.section-subheader-container')[1],
        header: document.querySelectorAll('.section-header-container')[2],
        form: document.getElementById('contact-container'),
        contactSection: document.getElementById('contact-section')
    }

    events = [
        { //Idle
            landscapeTrigger: () => this.domElements.scrollContainer.clientHeight - window.innerHeight - this.sizes.getAbsoluteHeight(this.domElements.contactSection),
            portraitTrigger: () => this.domElements.scrollContainer.clientHeight - window.innerHeight - this.sizes.getAbsoluteHeight(this.domElements.contactSection),
            event: () => this.animation.playIdle(),
            repeats: true
        },
        { //Transition
            landscapeTrigger: () => this.domElements.scrollContainer.clientHeight - (window.innerHeight * 1.5),
            portraitTrigger: () => this.domElements.scrollContainer.clientHeight - (window.innerHeight * 1.2),
            event: () => gsap.delayedCall(.5, () => this.animation.playTransition()),
        },
        { //Small Header
            landscapeTrigger: () => this.domElements.scrollContainer.clientHeight - this.sizes.getAbsoluteHeight(this.domElements.contactSection) - (window.innerHeight * 0.7),
            portraitTrigger: () => this.domElements.scrollContainer.clientHeight - this.sizes.getAbsoluteHeight(this.domElements.contactSection) - (window.innerHeight * 0.7),
            event: () => gsap.to(this.domElements.smallHeader, { y: 0, duration: .3 })
        },
        { //Header
            landscapeTrigger: () => this.domElements.scrollContainer.clientHeight - this.sizes.getAbsoluteHeight(this.domElements.contactSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader),
            portraitTrigger: () => this.domElements.scrollContainer.clientHeight - this.sizes.getAbsoluteHeight(this.domElements.contactSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader),
            event: () => gsap.to(this.domElements.header, { y: 0, duration: .5 })
        },
        { //Form
            landscapeTrigger: () => this.domElements.scrollContainer.clientHeight - this.sizes.getAbsoluteHeight(this.domElements.contactSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader) + this.sizes.getAbsoluteHeight(this.domElements.header),
            portraitTrigger: () => this.domElements.scrollContainer.clientHeight - this.sizes.getAbsoluteHeight(this.domElements.contactSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader) + this.sizes.getAbsoluteHeight(this.domElements.header),
            event: () => gsap.to(this.domElements.form, { y: 0, duration: .7 })
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll
        this.animation = this.experience.world.contact.animation
        this.sizes = this.experience.sizes

        if (!this.sizes.touch)
            this.setupPositions()

        this.addScrollEvents()
    }

    setupPositions() {
        gsap.to(this.domElements.smallHeader, { y: 150, duration: 0 })
        gsap.to(this.domElements.header, { y: 150, duration: 0 })
        gsap.to(this.domElements.form, { y: 150, duration: 0 })
    }

    resetPositions() {
        gsap.to(this.domElements.smallHeader, { y: 0, duration: 0 })
        gsap.to(this.domElements.header, { y: 0, duration: 0 })
        gsap.to(this.domElements.form, { y: 0, duration: 0 })
    }

    addScrollEvents() {
        this.events.forEach((event) => {
            //add event
            this.scroll.addEvent(this.sizes.portrait ? event.portraitTrigger() : event.landscapeTrigger(), 'down', () => {
                //play event and prevent replays
                if (!event.played || event.repeats) {
                    if (!event.repeats)
                        event.played = true

                    event.event()
                }
            })
        })
    }

    resize() {
        setTimeout(() => this.addScrollEvents())
    }
}