import Experience from '../Experience'
import { gsap, Power2 } from 'gsap'

export default class Menu {

    visible = false
    initials = {}
    isAnimating = false

    domElements = {
        menuButton: document.getElementById('menu-button'),
        menuContainer: document.getElementById('menu-container'),
        menuButtonBar0: document.getElementById('menu-button-bar-0'),
        menuButtonBar1: document.getElementById('menu-button-bar-1'),
        menuButtonBar2: document.getElementById('menu-button-bar-2'),
        landingPageContent: document.getElementById('landing-page-section'),
        aboutSection: document.getElementById('about-section'),
        scrollContainer: document.getElementById('scroll-container'),
        logoWhiteBackground: document.getElementById('logo-white-background'),
    }

    constructor() {
        this.experience = new Experience()
        this.landingPage = this.experience.ui.landingPage
        this.waypoints = this.experience.waypoints
        this.scroll = this.experience.ui.scroll
        this.labBackground = this.experience.world.background
        this.camera = this.experience.camera
        this.gestures = this.experience.gestures

        this.menuButtonClick()
        this.hideEvents()
    }

    menuButtonClick() {
        //Button Event Listener
        this.domElements.menuButton.addEventListener('click', () => {
            this.switchVisiblity()
        })
    }

    switchVisiblity(withCamera = true, force = false) {
        if ((!this.isAnimating && !this.landingPage.isAnimating) || force) {
            this.visible = !this.visible

            //Button
            this.visible ? this.crossMenuButton() : this.resetMenuButton()

            //Position
            this.domElements.menuContainer.style.right = this.visible ? '0' : 'calc(-350px - 10vw)'

            //Camera
            if (withCamera) this.landingPage.visible ? this.landingPageTransition() : this.scrollContainerTransition()

            //Content
            this.domElements.landingPageContent.style.left = this.visible ? '-100%' : '0'
            this.domElements.scrollContainer.style.left = this.visible ? '-100%' : '0'

            //Prevent too fast reopening
            this.isAnimating = true
            gsap.delayedCall(.9, () => this.isAnimating = false)
        }
    }

    //Open Menu with landing page view
    landingPageTransition() {
        this.waypoints.moveToWaypoint((this.visible ? 'landing-menu' : 'landing-page'), true, .9)
    }

    /**
     * Open Menu with scroll container view
     * Either lab or contact scene
     * and save initial positions to return to on menu close
     */
    scrollContainerTransition() {
        if (!this.visible) {
            //Close Menu
            this.returnToInitialPosition()
        } else {
            //Show Menu
            const labScene = this.scroll.scrollY <= this.domElements.aboutSection.clientHeight + (window.innerHeight * 0.12)
            this.setInitialPositions()
            labScene ? this.focusLabScene() : this.focusContactScene()
        }
    }

    setInitialPositions() {
        this.initials.cameraY = this.camera.instance.position.y
        this.initials.scrollY = this.scroll.contentScrollTo
        this.initials.logoBackgroundY = - this.scroll.contentScrollTo - window.innerHeight
    }

    returnToInitialPosition() {
        //Waypoint
        this.waypoints.moveToWaypoint('scroll-start')
        gsap.to(this.camera.instance.position, { y: this.initials.cameraY, duration: .9, ease: Power2.easeInOut })

        gsap.to(this.domElements.scrollContainer, { y: -this.initials.scrollY, duration: .9, ease: Power2.easeInOut })
        gsap.to(this.domElements.logoWhiteBackground, { y: this.initials.logoBackgroundY, duration: .9, ease: Power2.easeInOut })
    }

    focusLabScene() {
        gsap.to(this.labBackground.material.uniforms.uOffset, { value: 0, duration: .9 })
        gsap.to(this.domElements.scrollContainer, { y: 0, duration: .9, ease: Power2.easeInOut })
        gsap.to(this.domElements.logoWhiteBackground, { y: -window.innerHeight })
        this.waypoints.moveToWaypoint('lab-menu')
    }

    focusContactScene() {
        gsap.to(this.labBackground.material.uniforms.uOffset, { value: 2.3, duration: .9 })
        gsap.to(this.domElements.scrollContainer, { y: -this.domElements.scrollContainer.clientHeight + window.innerHeight, duration: .9, ease: Power2.easeInOut })
        this.waypoints.moveToWaypoint('contact-menu')
    }

    //Hide Event Triggers
    hideEvents() {
        this.landingPage.on('hide', () => {
            if (this.visible)
                this.switchVisiblity(false)
        })
        this.landingPage.on('show', () => {
            if (this.visible)
                this.switchVisiblity(false)
        })
        this.gestures.on('scroll', () => {
            if (this.visible) {
                this.switchVisiblity()
            }
        })
    }

    // Menu Button Animation
    crossMenuButton() {
        gsap.to(this.domElements.menuButtonBar0, { rotation: 45, y: 9, duration: .1 })
        gsap.to(this.domElements.menuButtonBar1, { opacity: 0, duration: .1 })
        gsap.to(this.domElements.menuButtonBar2, { rotation: -45, y: -9, duration: .1 })
    }

    resetMenuButton() {
        gsap.to(this.domElements.menuButtonBar0, { rotation: 0, y: 0, duration: .1 })
        gsap.to(this.domElements.menuButtonBar1, { opacity: 1, duration: .1 })
        gsap.to(this.domElements.menuButtonBar2, { rotation: 0, y: 0, duration: .1 })
    }

    resize() {
        if (this.visible)
            this.switchVisiblity(true, true)
    }
}