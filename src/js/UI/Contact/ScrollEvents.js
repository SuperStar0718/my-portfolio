import Experience from "../../Experience"
import { gsap } from 'gsap'
import ScrollEvent from "../ScrollEvent"

export default class ContactAnimationEvents {

    domElements = {
        smallHeader: document.querySelectorAll('.section-subheader-container')[1],
        header: document.querySelectorAll('.section-header-container')[2],
        form: document.getElementById('contact-container'),
        contactSection: document.getElementById('contact-section'),
    }

    constructor() {
        this.experience = new Experience()
        this.animation = this.experience.world.contact.animation
        this.sizes = this.experience.sizes

        this.addScrollEvents()
    }

    addScrollEvents() {
        this.scrollEvents = [
            // Idle
            new ScrollEvent({
                element: this.domElements.contactSection,
                direction: 'down',
                f: () => this.animation.playIdle(),
                repeats: true
            }),

            // Transition
            new ScrollEvent({
                element: this.domElements.contactSection,
                direction: 'down',
                f: () => gsap.delayedCall(.5, () => this.animation.playTransition()),
                offset: this.sizes.portrait ?
                    this.sizes.getAbsoluteHeight(this.domElements.header) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader) + this.sizes.getAbsoluteHeight(this.domElements.form) + (window.innerHeight * .3) :
                    this.domElements.contactSection.clientHeight * 0.5,
            }),

            // Small Header
            new ScrollEvent({
                element: this.domElements.smallHeader,
                direction: 'down',
                f: () => gsap.to(this.domElements.smallHeader, { y: 0, duration: .4 }),
                setup: () => gsap.to(this.domElements.smallHeader, { y: 200, duration: 0 }),
                reset: () => gsap.to(this.domElements.smallHeader, { y: 0, duration: 0 })
            }),

            //Header
            new ScrollEvent({
                element: this.domElements.header,
                direction: 'down',
                f: () => gsap.to(this.domElements.header, { y: 0, duration: .6 }),
                setup: () => gsap.to(this.domElements.header, { y: 200, duration: 0 }),
                reset: () => gsap.to(this.domElements.header, { y: 0, duration: 0 })
            }),

            //Form
            new ScrollEvent({
                element: this.domElements.form,
                direction: 'down',
                f: () => gsap.to(this.domElements.form, { y: 0, duration: .8 }),
                setup: () => gsap.to(this.domElements.form, { y: 200, duration: 0 }),
                reset: () => gsap.to(this.domElements.form, { y: 0, duration: 0 })
            }),
        ]
    }

    resetPositions() {
        this.scrollEvents.forEach(event => {
            if (event.reset)
                event.reset()
        })
    }

    resize() {
        setTimeout(() => this.addScrollEvents())
    }
}