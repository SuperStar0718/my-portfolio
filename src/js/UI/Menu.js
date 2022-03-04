import Experience from '../Experience'
import { gsap } from 'gsap'

export default class Menu {

    visible = false

    domElements = {
        menuButton: document.getElementById('menu-button'),
        menuContainer: document.getElementById('menu-container'),
        menuButtonBar0: document.getElementById('menu-button-bar-0'),
        menuButtonBar1: document.getElementById('menu-button-bar-1'),
        menuButtonBar2: document.getElementById('menu-button-bar-2'),
        landingPageContent: document.getElementById('landing-page-section'),
    }

    constructor() {
        this.experience = new Experience()
        this.landingPage = this.experience.ui.landingPage
        this.waypoints = this.experience.waypoints

        this.menuButtonClick()
        this.hideEvents()
    }

    menuButtonClick() {
        this.domElements.menuButton.addEventListener('click', () => {
            this.switchVisiblity()
        })
    }

    switchVisiblity(withCamera = true) {
        this.visible = !this.visible

        //Button
        this.visible ? this.crossMenuButton() : this.resetMenuButton()

        //Position
        this.domElements.menuContainer.style.right = this.visible ? '0' : 'calc(-350px - 10vw)'

        //Camera
        if (withCamera) this.landingPage.visible ? this.landingPageTransition() : this.scrollContainerTransition()

        //Content
        this.domElements.landingPageContent.style.left = this.visible ? '-100%' : '0'
    }

    scrollContainerTransition() {

    }

    landingPageTransition() {
        this.waypoints.moveToWaypoint((this.visible ? 'landing-menu' : 'landing-page'), true, .9)
    }

    hideEvents() {
        this.landingPage.on('hide', () => {
            if (this.visible)
                this.switchVisiblity(false)
        })
        this.landingPage.on('show', () => {
            if (this.visible)
            this.switchVisiblity(false)
        })
    }

    // Menu Button Animation
    crossMenuButton() {
        setTimeout(() => {
            gsap.to(this.domElements.menuButtonBar0, { rotation: 45, y: 9, duration: .1 })
            gsap.to(this.domElements.menuButtonBar1, { opacity: 0, duration: .1 })
            gsap.to(this.domElements.menuButtonBar2, { rotation: -45, y: -9, duration: .1 })
        }, 100)
    }

    resetMenuButton() {
        gsap.to(this.domElements.menuButtonBar0, { rotation: 0, y: 0, duration: .1 })
        gsap.to(this.domElements.menuButtonBar1, { opacity: 1, duration: .1 })
        gsap.to(this.domElements.menuButtonBar2, { rotation: 0, y: 0, duration: .1 })
    }
}