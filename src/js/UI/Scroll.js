import Experience from '../Experience'
import { gsap } from 'gsap'
import EventEmitter from '../Utils/EventEmitter'

export default class Scroll extends EventEmitter {

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
        super()

        this.experience = new Experience()
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes
        this.landingPage = this.experience.ui.landingPage
        this.time = this.experience.time
        this.background = this.experience.world.background
        this.fog = this.experience.world.fog

        //Hide scroll container
        this.domElements.scrollContainer.style.top = '100%'

        this.events = []

        this.initEventListener()
        this.setAboutContainerDetails()
        this.setLogoOverlayHeight()
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
        this.on('wheel-' + direction, () => {
            if ((direction === 'up' ? height >= this.scrollY : height <= this.scrollY) && !this.events[index].played) {
                //execute
                this.events[index].task()

                //prevent multiple playing
                this.events[index].played = true
            }
        })

        //check if unique -> listen to opposite direction to make event playable again
        if (!unique) this.on('wheel-' + (direction === 'up' ? 'down' : 'up'), () => {
            if ((direction === 'up' ? height < this.scrollY : height > this.scrollY) && this.events[index].played) {
                this.events[index].played = false
            }
        })
    }

    initEventListener() {
        window.addEventListener('wheel', () => {
            this.scroll(Math.sign(event.deltaY))
        })
    }

    scroll(direction) {
        if (!this.landingPage.isAnimating && !this.landingPage.visible) {
            if (direction == -1 && this.scrollY <= 0) {
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

            //Trigger Event Emitter
            this.trigger(direction == -1 ? 'wheel-up' : 'wheel-down')
        }
    }

    preventFromScrollingBottom() {
        //set scrollTo to maximum bottom
        if (this.scrollY >= this.domElements.scrollContainer.clientHeight - window.innerHeight) {
            return this.domElements.scrollContainer.clientHeight - window.innerHeight
        } else {
            return this.scrollY
        }
    }

    performScroll() {
        const contentScrollTo = this.preventFromScrollingBottom()

        let scrollPercentage = 0
        if (this.scrollY > this.aboutContainer.offset) {
            scrollPercentage = (this.scrollY - this.aboutContainer.offset) / (this.domElements.scrollContainer.clientHeight - this.aboutContainer.height)
        }

        //cap scroll percentage
        if (scrollPercentage < 0) scrollPercentage = 0
        if (scrollPercentage > 1) scrollPercentage = 1

        //Scroll Container
        gsap.to(this.domElements.scrollContainer, { y: -contentScrollTo, duration: this.parameters.scrollDuration })


        if (scrollPercentage >= 0) {
            //Background Plane
            gsap.to(this.background.material.uniforms.uOffset, { value: contentScrollTo * scrollPercentage / window.innerHeight, duration: this.parameters.scrollDuration })

            //Camera
            gsap.to(this.camera.instance.position, { y: -12.4 * scrollPercentage - 10, duration: this.parameters.scrollDuration })

            //Fog
            gsap.to(this.fog, { near: (7 * scrollPercentage) + 12, far: (2.7 * scrollPercentage) + 16.3 })

            //Logo Background
            gsap.to(this.domElements.logoWhiteBackground, { y: - contentScrollTo - window.innerHeight, duration: this.parameters.scrollDuration })
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

    setLogoOverlayHeight() {
        document.getElementById('logo-white-background').style.height = this.aboutContainer.height + (window.innerHeight * 0.07) + 'px'
    }

    resize() {
        this.events = []
        this.setAboutContainerDetails()
        this.setLogoOverlayHeight()
        if (!this.landingPage.visible) this.performScroll()
    }
}