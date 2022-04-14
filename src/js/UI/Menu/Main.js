import Experience from '../../Experience'
import { gsap, Power2 } from 'gsap'
import EventEmitter from '../../Utils/EventEmitter'

export default class MenuMain extends EventEmitter {

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
        super()

        this.experience = new Experience()
        this.landingPage = this.experience.ui.landingPage
        this.waypoints = this.experience.waypoints
        this.scroll = this.experience.ui.scroll
        this.labBackground = this.experience.world.background
        this.camera = this.experience.camera
        this.gestures = this.experience.gestures
        this.transition = this.experience.ui.transition
        this.sounds = this.experience.sounds
        this.sizes = this.experience.sizes
        this.contactAnimation = this.experience.world.contact.animation
        this.character = this.experience.world.character

        this.menuButtonClick()
        this.hideEvents()

        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    onOrientationChange() {
        //always clsoe on orientation change
        if (this.visible)
            this.switchVisiblity(true, true)

        //Menu position
        this.domElements.menuContainer.style.right = this.sizes.portrait ? '-100%' : 'calc(-350px - 10vw)'
    }

    menuButtonClick() {
        //Button Event Listener
        this.domElements.menuButton.addEventListener('click', () => {
            //sound
            if (!this.isAnimating)
                this.sounds.play('buttonClick')

            this.switchVisiblity()
        })
    }

    switchVisiblity(withCamera = true, force = false) {
        if ((!this.isAnimating && !this.landingPage.isAnimating && !this.transition.isShowing) || force) {
            //Trigger Event
            this.trigger(this.visible ? 'hide' : 'open')

            this.visible = !this.visible

            //Position
            this.domElements.menuContainer.style.right = this.visible ? '0' : (this.sizes.portrait ? '-100%' : 'calc(-350px - 10vw)')
            if (this.sizes.portrait) gsap.to(this.domElements.logoWhiteBackground, { opacity: this.visible ? 0 : 1, duration: .7 })

            //Button
            this.visible ? this.crossMenuButton() : this.resetMenuButton()

            //start transition
            if (withCamera && !this.sizes.portrait)
                this.landingPage.visible ? this.landingPageTransition() : this.scrollContainerTransition()

            //Prevent too fast reopening
            this.isAnimating = true
            gsap.delayedCall(.9, () => this.isAnimating = false)

            //Scroll Icons
            this.fadeScrollIcons(!this.visible)
        }
    }

    //Open Menu with landing page view
    landingPageTransition() {
        this.waypoints.moveToWaypoint((this.visible ? 'landing-menu' : 'landing-page'), true, .9)
        this.domElements.landingPageContent.style.left = this.visible ? '-100%' : '0'
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

            this.domElements.scrollContainer.style.left = '0'
        } else {
            //Is lab or contact scene? focues depdening on result
            const labScene = this.scroll.scrollY <= this.domElements.aboutSection.clientHeight + (window.innerHeight * 0.12)
            labScene ? this.focusLabScene() : this.focusContactScene()

            this.domElements.scrollContainer.style.left = '-100%'

            this.setInitialPositions()
        }
    }

    setInitialPositions() {
        this.initials.cameraY = this.camera.instance.position.y
        this.initials.scrollY = this.scroll.contentScrollTo
        this.initials.logoBackgroundY = - this.scroll.contentScrollTo - window.innerHeight
        this.initials.backgroundY = this.labBackground.material.uniforms.uOffset.value
    }

    returnToInitialPosition() {
        //camera
        this.waypoints.moveToWaypoint('scroll-start')
        gsap.to(this.camera.instance.position, { y: this.initials.cameraY, duration: .9, ease: Power2.easeInOut })

        //return elements to positon
        gsap.to(this.domElements.scrollContainer, { y: -this.initials.scrollY, duration: .9, ease: Power2.easeInOut })
        gsap.to(this.domElements.logoWhiteBackground, { y: this.initials.logoBackgroundY, duration: .9, ease: Power2.easeInOut })
        gsap.to(this.labBackground.material.uniforms.uOffset, { value: this.initials.backgroundY, duration: .9, ease: Power2.easeInOut })

        //Lab Sounds
        this.sounds.labAmbienceScroll('recent')
    }

    focusLabScene() {
        //Background
        gsap.to(this.labBackground.material.uniforms.uOffset, { value: 0, duration: .9 })

        //set scroll y to 0
        gsap.to(this.domElements.scrollContainer, { y: 0, duration: .9, ease: Power2.easeInOut })

        //Logo background
        gsap.to(this.domElements.logoWhiteBackground, { y: -window.innerHeight })

        //camera
        this.waypoints.moveToWaypoint('lab-menu')

        //sound
        this.sounds.muteGroup('lab', false, .4)

        //rest character if needed
        if (this.character.body.model.position.y != -18.95)
            this.experience.ui.about.animations.resetCharacterToPosition()
    }

    focusContactScene() {
        //Lab background
        gsap.to(this.labBackground.material.uniforms.uOffset, { value: this.labBackground.height, duration: .9 })

        //set scroll y to bottom
        gsap.to(this.domElements.scrollContainer, { y: -this.domElements.scrollContainer.clientHeight + window.innerHeight, duration: .9, ease: Power2.easeInOut })

        //camera
        this.waypoints.moveToWaypoint('contact-menu')

        //Animation
        this.contactAnimation.playIdle()
        gsap.delayedCall(1, () => this.contactAnimation.playTransition())
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
            if (this.visible)
                this.switchVisiblity()
        })
    }

    fadeScrollIcons(visible) {
        const icons = document.querySelectorAll('.scroll-container')

        for (let i = 0; i < icons.length; i++) {
            const icon = icons[i]

            if (!(this.landingPage.visible && i == 1) || !this.landingPage.visible)
                gsap.to(icon, { opacity: (visible ? 1 : 0) })
        }
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