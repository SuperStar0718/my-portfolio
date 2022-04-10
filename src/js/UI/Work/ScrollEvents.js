import Experience from "../../Experience"
import { gsap } from 'gsap'

export default class WorkScrollEvents {

    domElements = {
        aboutSection: document.getElementById('about-section'),
        smallHeader: document.querySelector('.section-subheader-container'),
        header0: document.querySelector('.section-header-container'),
        header1: document.querySelectorAll('.section-header-container')[1],
        cards: document.querySelectorAll('.work-item-container'),
    }

    events = [
        { //Small Header
            landscapeTrigger: () => this.sizes.getAbsoluteHeight(this.domElements.aboutSection) - (window.innerHeight * 0.7),
            portraitTrigger: () => this.sizes.getAbsoluteHeight(this.domElements.aboutSection) - (window.innerHeight * 0.7),
            event: () => gsap.to(this.domElements.smallHeader, { y: 0, duration: .4 })
        },
        { //Header 0
            landscapeTrigger: () => this.sizes.getAbsoluteHeight(this.domElements.aboutSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader),
            portraitTrigger: () => this.sizes.getAbsoluteHeight(this.domElements.aboutSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader),
            event: () => gsap.to(this.domElements.header0, { y: 0, duration: .6 })
        },
        { //Header 1
            landscapeTrigger: () => this.sizes.getAbsoluteHeight(this.domElements.aboutSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader) + this.sizes.getAbsoluteHeight(this.domElements.header0),
            portraitTrigger: () => this.sizes.getAbsoluteHeight(this.domElements.aboutSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader) + this.sizes.getAbsoluteHeight(this.domElements.header0),
            event: () => gsap.to(this.domElements.header1, { y: 0, duration: .8 })
        },
        { //Cards
            landscapeTrigger: () => this.sizes.getAbsoluteHeight(this.domElements.aboutSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader) + this.sizes.getAbsoluteHeight(this.domElements.header0) + this.sizes.getAbsoluteHeight(this.domElements.header1) + 100,
            portraitTrigger: () => this.sizes.getAbsoluteHeight(this.domElements.aboutSection) - (window.innerHeight * 0.7) + this.sizes.getAbsoluteHeight(this.domElements.smallHeader) + this.sizes.getAbsoluteHeight(this.domElements.header0) + this.sizes.getAbsoluteHeight(this.domElements.header1)+ 100,
            event: () => {
                gsap.to(this.domElements.cards[0], { y: 0, duration: .3 })
                gsap.to(this.domElements.cards[1], { y: 0, duration: .25 })
                gsap.to(this.domElements.cards[2], { y: 0, duration: .2 })
                gsap.to(this.domElements.cards[3], { y: 0, duration: .25 })
                gsap.to(this.domElements.cards[4], { y: 0, duration: .3 })
            }
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.scroll = this.experience.ui.scroll
        this.sizes = this.experience.sizes

        this.setupPositions()
        this.addScrollEvents()
    }

    setupPositions() {
        //Header
        gsap.to(this.domElements.smallHeader, { y: 200, duration: 0 })
        gsap.to(this.domElements.header0, { y: 200, duration: 0 })
        gsap.to(this.domElements.header1, { y: 200, duration: 0 })

        //Cards
        gsap.to(this.domElements.cards[0], { y: 200, duration: 0 })
        gsap.to(this.domElements.cards[1], { y: 200, duration: 0 })
        gsap.to(this.domElements.cards[2], { y: 200, duration: 0 })
        gsap.to(this.domElements.cards[3], { y: 200, duration: 0 })
        gsap.to(this.domElements.cards[4], { y: 200, duration: 0 })
    }

    resetPositions() {
        //Header
        gsap.to(this.domElements.smallHeader, { y: 0, duration: 0 })
        gsap.to(this.domElements.header0, { y: 0, duration: 0 })
        gsap.to(this.domElements.header1, { y: 0, duration: 0 })

        //Cards
        gsap.to(this.domElements.cards[0], { y: 0, duration: 0 })
        gsap.to(this.domElements.cards[1], { y: 0, duration: 0 })
        gsap.to(this.domElements.cards[2], { y: 0, duration: 0 })
        gsap.to(this.domElements.cards[3], { y: 0, duration: 0 })
        gsap.to(this.domElements.cards[4], { y: 0, duration: 0 })
    }

    addScrollEvents() {
        this.events.forEach((event) => {
            //add event
            this.scroll.addEvent(this.sizes.portrait ? event.portraitTrigger() : event.landscapeTrigger(), 'down', () => {
                //play event and prevent replays
                if (!event.played) {
                    event.played = true
                    event.event()
                }
            })
        })
    }

    resize() {
        this.addScrollEvents()
    }
}