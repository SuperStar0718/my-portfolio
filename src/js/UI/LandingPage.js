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
    }

    constructor() {
        super()

        this.experience = new Experience()
        this.gestures = this.experience.gestures
        this.camera = this.experience.camera
        this.room = this.experience.world.landingPage.room.model
        this.roomShadow = this.experience.world.landingPage.roomShadow.model
        this.background = this.experience.world.background
        this.renderer = this.experience.renderer
        this.about = this.experience.ui.about
        this.character = this.experience.world.character
        this.waypoints = this.experience.waypoints
        this.scrollIcon = this.experience.ui.scrollIcon

        this.gestures.on('scroll-down', () => this.hide())
    }

    hide() {
        if (this.visible && !this.isAnimating) {
            this.visible = false
            this.lockScrolling()
            this.scrollIcon.hide()

            //Room Bounce
            gsap.fromTo(this.room.scale, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0, duration: .5, ease: Back.easeIn.config(1.7) })

            this.lockScrolling()

            setTimeout(() => {
                // Landing Page Content
                this.domElements.landingPage.style.top = '-100%'

                //Scroll Container
                this.domElements.scrollContainer.style.top = '0'

                //Camera
                this.waypoints.moveToWaypoint('scroll-start', true, this.scrollAnimationDuration)

                //Background
                gsap.to(this.background.material.uniforms.uOffset, { value: 0, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

                //Logo
                gsap.to(this.domElements.logoWhiteBackground, { y: -window.innerHeight, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

                //Fog
                setTimeout(() => gsap.to(this.experience.scene.fog, { near: 12, far: 16.3, duration: this.scrollAnimationDuration, ease: Power4.easeOut }), 300)

                //Render Clear Color
                setTimeout(() => this.renderer.instance.setClearColor('#EFE7DC'), 700)

                //About hologram animation
                this.experience.ui.about.tabbedContent.playHologramAnimation(.35)

                // Character Animation
                this.character.animation.play('fallDown', .3)

                // Update Face3
                this.character.body.face.material.map = this.character.body.faceTextures.scared
                if (this.character.body.faceCall) {
                    this.character.body.faceCall.kill()
                }

                //character fall down and scale down to adapt to scene
                gsap.to(this.character.model.position, { y: -14.95, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })
                gsap.to(this.character.model.scale, { x: 0.97, y: 0.97, z: 0.97, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })

                //play water idle animation 
                setTimeout(() => {
                    this.character.animation.play('waterIdle', .5)
                }, 500)

                //spawn bubbles
                setTimeout(() => {
                    const totalBubbles = 12
                    for (let i = 0; i < totalBubbles; i++) {
                        this.experience.world.lab.bubbles.spawnBubble(Math.random() * 1.8 + 1.2, 'back')
                    }
                }, 50)

                this.experience.world.lab.bubbles.hideAllBubbles()

                //Start wireframe material switch
                this.character.checkForWireframe = 'down'
                gsap.delayedCall(this.scrollAnimationDuration, () => this.character.checkForWireframe = null)

                this.trigger('hide')
            }, 200)
        }
    }

    show() {
        if (this.domElements.scrollContainer.scrollTop == 0 && !this.visible && !this.isAnimating) {
            this.visible = true

            //Lock scrolling depending on last scroll top
            this.lockScrolling()

            //Room Bounce
            gsap.fromTo(this.room.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: .5, ease: Back.easeOut.config(1.7), delay: .47 })

            // Landing Page Content
            this.domElements.landingPage.style.top = '0'

            //Scroll Container
            this.domElements.scrollContainer.style.top = '100%'

            //Camera
            this.waypoints.moveToWaypoint('landing-page', true, this.scrollAnimationDuration)

            //Background
            gsap.to(this.background.material.uniforms.uOffset, { value: -2.1, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })

            //Logo
            gsap.to(this.domElements.logoWhiteBackground, { y: 0, ease: Power2.easeInOut, duration: this.scrollAnimationDuration })

            //Fog
            setTimeout(() => gsap.to(this.experience.scene.fog, { near: 15, far: 20, duration: this.scrollAnimationDuration }), 300)

            //Renderer Clear color
            this.renderer.instance.setClearColor('#F5EFE6')

            // character position
            gsap.to(this.character.model.position, { y: -5.7, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })
            gsap.to(this.character.model.scale, { x: 1, y: 1, z: 1, duration: this.scrollAnimationDuration, ease: Power2.easeInOut })

            // character animation
            this.character.animation.play('idle', .5)

            // Set mouse position back to initial one
            this.experience.world.landingPage.mouse.moveToIdleStartPositon()

            // update face
            this.character.body.face.material.map = this.character.body.faceTextures.default

            // start inverals, if not started yet
            if (!this.character.leftDesktopIntervalCall) {
                this.character.leftDesktopInterval()
            }
            if (!this.character.scrollIntervalCall) {
                this.character.scrollInterval()
            }

            //Start wireframe material switch
            this.character.checkForWireframe = 'up'
            gsap.delayedCall(this.scrollAnimationDuration, () => this.character.checkForWireframe = null)

            this.trigger('show')
        }
    }

    lockScrolling() {
        //Deactivate to prevent too fast scrolling
        this.isAnimating = true
        setTimeout(() => this.isAnimating = false, this.scrollAnimationDuration * 1000 + 100)
    }
}