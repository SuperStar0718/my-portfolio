import Experience from '../Experience'
import { gsap, Power2, Power4, Back } from 'gsap'
import EventEmitter from '../Utils/EventEmitter'

export default class LandingPage extends EventEmitter {

    scrollAnimationDuration = .8
    visible = true
    isAnimating = false

    domElements = {
        landingPage: document.getElementById('landing-page'),
        scrollContainer: document.getElementById('scroll-container'),
        logoWhiteBackground: document.getElementById('logo-white-background'),
        contentSvg: document.getElementById('landing-content-svg'),
        heading0: document.querySelectorAll('.landing-headline')[0],
        heading1: document.querySelectorAll('.landing-headline')[1],
        subheading: document.querySelector('.landing-subheading'),
        button: document.getElementById('landing-cta-button'),
        aboutMeButton: document.getElementById('landing-more-about-me'),
    }

    constructor() {
        super()

        this.experience = new Experience()
        this.gestures = this.experience.gestures
        this.camera = this.experience.camera
        this.room = this.experience.world.landingPage.room
        this.roomShadow = this.experience.world.landingPage.roomShadow.model
        this.background = this.experience.world.background
        this.renderer = this.experience.renderer
        this.about = this.experience.ui.about
        this.character = this.experience.world.character
        this.waypoints = this.experience.waypoints
        this.scrollIcon = this.experience.ui.scrollIcon
        this.transiton = this.experience.ui.transition
        this.sounds = this.experience.sounds
        this.sizes = this.experience.sizes
        this.waypoints = this.experience.waypoints
        this.contactAnimation = this.experience.world.contact.animation
        this.intro = this.experience.ui.intro

        //Hide Triggers
        this.gestures.on('scroll-down', () => this.hide())
        this.gestures.on('touch-down', () => this.hide())

        this.waypoints.moveToWaypoint(this.sizes.portrait ? 'landing-page-portrait' : 'landing-page', false)

        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())

    }

    onOrientationChange() {
        if (this.visible) {
            this.waypoints.moveToWaypoint(this.sizes.portrait ? 'landing-page-portrait' : 'landing-page', false)
        }
    }

    playOpeningAnimation(delay = 0) {
        gsap.fromTo(this.domElements.contentSvg, { opacity: 0 }, { opacity: 1, delay: delay, duration: .4 })
        gsap.fromTo(this.domElements.contentSvg, { x: this.domElements.contentSvg.clientWidth * 0.6, scale: .6 }, { x: 0, scale: 1, delay: delay, duration: .6, ease: Back.easeOut.config(1.4) })
    }

    hide() {
        if (this.visible && !this.isAnimating && !this.experience.ui.menu.main.visible && !this.experience.ui.menu.main.isAnimating && !this.transiton.isShowing) {
            this.visible = false

            this.lockScrolling()

            this.scrollIcon.hide()

            this.sounds.muteGroup('landing', true, 1)
            this.sounds.muteGroup('lab', false, 2)

            //Room Bounce
            this.room.bounceOut()

            setTimeout(() => {
                // Landing Page Content
                this.domElements.landingPage.style.top = '-100%'

                //Scroll Container
                this.domElements.scrollContainer.style.top = '0'

                //Camera
                this.waypoints.moveToWaypoint((this.sizes.portrait ? 'scroll-start-portrait' : 'scroll-start'), true, this.scrollAnimationDuration)

                //Background
                gsap.to(this.background.material.uniforms.uOffset, { value: 0, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

                //Logo
                gsap.to(this.domElements.logoWhiteBackground, { y: -window.innerHeight, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

                //Render Clear Color
                setTimeout(() => this.renderer.instance.setClearColor('#EFE7DC'), 700)

                //About hologram animation
                this.experience.ui.about.animations.hologramPlayed = false
                this.experience.ui.about.animations.playHologramAnimation(.5)

                // Character Animation
                this.character.animation.play('fallDown', .35)

                // Update Face
                this.character.body.face.material.map = this.character.body.faceTextures.scared

                //character fall down
                gsap.to(this.character.model.position, { y: -18.95, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })
                gsap.delayedCall(.4, () => this.sounds.play('waterSplash'))

                //play water idle animation 
                setTimeout(() => {
                    this.character.animation.play('waterIdle', .9)
                }, 650)

                //spawn bubbles
                setTimeout(() => {
                    const totalBubbles = 12
                    for (let i = 0; i < totalBubbles; i++) {
                        this.experience.world.lab.bubbles.spawnBubble(Math.random() * 1.8 + 1.2, 'back')
                    }
                }, 50)

                //Start wireframe material switch
                this.character.checkForWireframe = 'down'
                gsap.delayedCall(this.scrollAnimationDuration, () => this.character.checkForWireframe = null)

                this.trigger('hide')
            }, 200)
        }
    }

    show() {
        if (this.domElements.scrollContainer.scrollTop == 0 && !this.visible && !this.isAnimating && !this.transiton.isShowing) {
            this.visible = true
            this.sounds.muteGroup('landing', false, 1)
            this.sounds.muteGroup('lab', true, 1)

            //Lock scrolling depending on last scroll top
            this.lockScrolling()

            //Room Bounce
            this.room.bounceIn(.5)

            // Landing Page Content
            this.domElements.landingPage.style.top = '0'

            //Scroll Container
            this.domElements.scrollContainer.style.top = '100%'

            //Camera
            this.waypoints.moveToWaypoint((this.sizes.portrait ? 'landing-page-portrait' : 'landing-page'), true, this.scrollAnimationDuration)

            //Background
            gsap.to(this.background.material.uniforms.uOffset, { value: -this.background.height, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })

            //Logo
            gsap.to(this.domElements.logoWhiteBackground, { y: 0, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

            //Renderer Clear color
            this.renderer.instance.setClearColor('#F5EFE6')

            // character position
            gsap.to(this.character.model.position, { y: -5.7, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })

            // character animation
            gsap.delayedCall(.1, () => this.character.animation.play('idle', .4))

            //Restart calls
            if (this.character.scrollIntervalCall)
                this.character.scrollIntervalCall.restart(true)

            if (this.character.leftDesktopIntervalCall)
                this.character.leftDesktopIntervalCall.restart(true)

            // Set mouse position back to initial one
            this.experience.world.landingPage.mouse.moveToIdleStartPositon()

            // update face
            this.character.body.face.material.map = this.character.body.faceTextures.default

            //Start wireframe material switch
            this.character.checkForWireframe = 'up'
            gsap.delayedCall(this.scrollAnimationDuration, () => this.character.checkForWireframe = null)

            this.contactAnimation.resetCharacter()

            this.trigger('show')
        }
    }

    lockScrolling() {
        //Deactivate to prevent too fast scrolling
        this.isAnimating = true
        setTimeout(() => this.isAnimating = false, this.scrollAnimationDuration * 1000 + 200)
    }
}