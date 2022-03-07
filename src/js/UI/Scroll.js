import Experience from '../Experience'
import { gsap } from 'gsap'

export default class Scroll {

    parameters = {
        scrollStrength: 140,
        scrollDuration: .5,
    }

    scrollY = 0
    startScrollY = 1000

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
        this.fog = this.experience.world.fog
        this.gestures = this.experience.gestures

        //Hide scroll container
        this.domElements.scrollContainer.style.top = '100%'
        setTimeout(() => this.domElements.scrollContainer.classList.add('scroll-container-transitions'))

        this.events = []

        this.setAboutContainerDetails()
        this.setLogoOverlayHeight()

        //Scroll
        this.gestures.on('scroll-down', () => this.scroll(1))
        this.gestures.on('scroll-up', () => this.scroll(-1))
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
        this.gestures.o('scroll-' + direction, () => {
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

    scroll(direction) {
        if (!this.landingPage.isAnimating && !this.landingPage.visible && !this.experience.ui.menu.main.visible && !this.experience.ui.menu.main.isAnimating) {
            if (direction == -1 && this.scrollY <= 0) {
                //Open landing page
                this.checkLandingPageOpening()
            } else if (this.scrollY != 0 || direction == 1) {
                //check if scroll is possible
                if (this.scrollY < this.domElements.scrollContainer.clientHeight - window.innerHeight || direction == -1) {
                    //set scroll height if possible
                    this.scrollY += direction * this.parameters.scrollStrength

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

    performScroll() {
        this.contentScrollTo = this.preventFromScrollingBottom()

        let scrollPercentage = 0
        if (this.scrollY > this.aboutContainer.offset) {
            scrollPercentage = (this.scrollY - this.aboutContainer.offset) / (this.domElements.scrollContainer.clientHeight - this.aboutContainer.height)
        }

        //cap scroll percentage
        if (scrollPercentage < 0) scrollPercentage = 0
        if (scrollPercentage > 1) scrollPercentage = 1

        //Scroll Container
        gsap.to(this.domElements.scrollContainer, { y: -this.contentScrollTo, duration: this.parameters.scrollDuration })


        if (scrollPercentage >= 0) {
            //Background Plane
            gsap.to(this.background.material.uniforms.uOffset, { value: 2.3 * scrollPercentage, duration: this.parameters.scrollDuration })

            //Camera
            gsap.to(this.camera.instance.position, { y: -12.4 * scrollPercentage - 10, duration: this.parameters.scrollDuration })

            //Fog
            gsap.to(this.fog, { near: (7 * scrollPercentage) + 12, far: (2.7 * scrollPercentage) + 16.3 })

            //Logo Background
            gsap.to(this.domElements.logoWhiteBackground, { y: - this.contentScrollTo - window.innerHeight, duration: this.parameters.scrollDuration })
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
        document.getElementById('logo-white-background').style.height = this.aboutContainer.height + (window.innerHeight * 0.12) + 'px'
    }

    resize() {
        //Clear events and reinitialize
        this.events = []
        
        this.setAboutContainerDetails()
        this.setLogoOverlayHeight()
        if (!this.landingPage.visible) this.performScroll()
    }
}