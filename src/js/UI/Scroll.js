import Experience from '../Experience'
import { gsap } from 'gsap'

export default class Scroll {

    parameters = {
        scrollStrength: 140,
        scrollDuration: .5,
    }

    scrollY = 0

    domElements = {
        scrollContainer: document.getElementById('scroll-container'),
        logoWhiteBackground: document.getElementById('logo-white-background'),
    }

    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes
        this.landingPage = this.experience.ui.landingPage
        this.time = this.experience.time
        this.background = this.experience.world.background
        this.fog = this.experience.world.fog.fog
        this.gestures = this.experience.gestures
        this.transition = this.experience.ui.transition
        this.sounds = this.experience.sounds
        this.waypoints = this.experience.waypoints

        //Hide scroll container
        this.domElements.scrollContainer.style.top = '100%'
        setTimeout(() => this.domElements.scrollContainer.classList.add('scroll-container-transitions'))

        this.events = []

        this.setCameraRange()
        this.setAboutContainerDetails()
        this.setLogoOverlayHeight()

        //Scroll
        this.gestures.on('scroll-down', () => this.scroll(1))
        this.gestures.on('scroll-up', () => this.scroll(-1))

        //Touch
        this.gestures.on('touch-down', () => this.scroll(1, -this.gestures.touchDistanceY * 2))
        this.gestures.on('touch-up', () => this.scroll(-1, this.gestures.touchDistanceY * 2))

        //Reset Y on open
        this.landingPage.on('hide', () => {
            if (this.scrollY != 0) {
                this.scrollY = 0
            }
        })

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    onOrientationChange() {
        this.setCameraRange()

        if (!this.landingPage.visible) {
            this.moveToTop()
        }
    }

    moveToTop() {
        this.waypoints.moveToWaypoint((this.sizes.portrait ? 'scroll-start-portrait' : 'scroll-start'), false)
        this.scrollY = 0
        this.performScroll(0)
        this.experience.ui.header.show()
    }

    setCameraRange() {
        this.cameraRange = {}

        const waypoint = this.waypoints.waypoints.find((waypoint) => waypoint.name === (this.sizes.portrait ? 'scroll-start-portrait' : 'scroll-start'))

        this.cameraRange.top = waypoint.position.y
        this.cameraRange.bottom = this.sizes.portrait ? -50 : -22.4
    }

    setAboutContainerDetails() {
        this.aboutContainer = {}
        this.aboutContainer.dom = document.getElementById('about-section')
        this.aboutContainer.offset = this.aboutContainer.dom.clientHeight - window.innerHeight
        this.aboutContainer.height = this.aboutContainer.dom.clientHeight
    }

    addEvent(height, direction, task, unique) {
        //Add to array
        this.events.push({ height: height, direction: direction, task: task, played: false })
        const index = this.events.length - 1

        //wheel event listeners
        this.gestures.on('scroll-' + direction, () => {
            if ((direction === 'up' ? height >= this.scrollY : height <= this.scrollY) && !this.events[index].played) {
                //execute
                this.events[index].task()

                //prevent multiple playing
                this.events[index].played = true
            }
        })

        //check if unique -> listen to opposite direction to make event playable again
        if (!unique) this.gestures.on('scroll-' + (direction === 'up' ? 'down' : 'up'), () => {
            if ((direction === 'up' ? height < this.scrollY : height > this.scrollY) && this.events[index].played) {
                this.events[index].played = false
            }
        })
    }

    scroll(direction, strength = this.parameters.scrollStrength) {
        if (!this.landingPage.isAnimating && !this.landingPage.visible && !this.experience.ui.menu.main.visible && !this.experience.ui.menu.main.isAnimating && !this.transition.isShowing) {
            if (direction == -1 && this.scrollY <= 0) {
                //Open landing page
                this.checkLandingPageOpening()
            } else if (this.scrollY != 0 || direction == 1) {
                //check if scroll is possible
                if (this.scrollY < this.domElements.scrollContainer.clientHeight - window.innerHeight || direction == -1) {
                    //set scroll height if possible
                    this.scrollY += direction * strength

                    this.performScroll()
                }
            }

            //update last wheel to prevent too slow scrolling down before opening landing page
            if (direction == -1) this.updateLastWheelUp()
        }
    }

    preventFromScrollingBottom() {
        /**
         * Set scroll maximum at bottom
         *  return original scrollY if not required
        **/
        if (this.scrollY >= this.domElements.scrollContainer.clientHeight - window.innerHeight) {
            return this.domElements.scrollContainer.clientHeight - window.innerHeight
        } else {
            return this.scrollY
        }
    }

    performScroll(duration = this.parameters.scrollDuration) {
        this.contentScrollTo = this.preventFromScrollingBottom()

        let scrollPercentage = 0
        if (this.scrollY > this.aboutContainer.offset || this.sizes.portrait) {
            if (this.sizes.portrait) {
                scrollPercentage = this.contentScrollTo / this.domElements.scrollContainer.clientHeight
                this.sounds.labAmbienceScroll(this.scrollY / this.aboutContainer.height)
            }
            else {
                scrollPercentage = (this.contentScrollTo - this.aboutContainer.offset) / (this.domElements.scrollContainer.clientHeight - this.aboutContainer.height)
                this.sounds.labAmbienceScroll((this.contentScrollTo - this.aboutContainer.offset) / ((this.domElements.scrollContainer.clientHeight * 0.7) - this.aboutContainer.height))
            }
        } else {
            this.sounds.labAmbienceScroll(0)
        }

        //cap scrollY at 0
        if (this.contentScrollTo < 0) this.contentScrollTo = 0

        //cap scroll percentage
        if (scrollPercentage < 0) scrollPercentage = 0
        if (scrollPercentage > 1) scrollPercentage = 1

        //Scroll Container
        gsap.to(this.domElements.scrollContainer, { y: -this.contentScrollTo, duration: duration })

        if (scrollPercentage >= 0) {
            //Background Plane
            gsap.to(this.background.material.uniforms.uOffset, { value: (this.background.height * 1.5) * scrollPercentage, duration: duration })

            //Camera
            gsap.to(this.camera.instance.position, { y: (this.cameraRange.bottom - this.cameraRange.top) * scrollPercentage + this.cameraRange.top, duration: duration })

            //Fog
            gsap.to(this.fog, { near: ((this.sizes.portrait ? 13 : 7) * scrollPercentage) + (this.sizes.portrait ? 18.5 : 12), far: ((this.sizes.portrait ? 8.7 : 2.7) * scrollPercentage) + (this.sizes.portrait ? 23 : 16.3) })

            //Logo Background
            gsap.to(this.domElements.logoWhiteBackground, { y: - this.contentScrollTo - window.innerHeight , duration: duration })
        }
    }

    checkLandingPageOpening() {
        //open landing if user isnt scrolling too fast
        if (this.time.current - this.lastWheelUp > 200) {
            this.landingPage.show()
        }
    }

    updateLastWheelUp() {
        this.lastWheelUp = this.time.current
    }

    //Re-position logo white background
    setLogoOverlayHeight() {
        document.getElementById('logo-white-background').style.height = this.aboutContainer.height + (window.innerHeight * (this.sizes.portrait ? 0.03 : 0.12)) +'px'
    }

    resize() {
        //Clear events and reinitialize
        this.events = []

        this.setAboutContainerDetails()
        this.setLogoOverlayHeight()

        if (!this.landingPage.visible) this.performScroll(0)
    }
}