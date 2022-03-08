import Experience from '../../Experience'
import { gsap } from 'gsap'

export default class MenuItems {

    domElements = {
        scrollContainer: document.getElementById('scroll-container'),
        landingPage: document.getElementById('landing-page'),
        landingPageContent: document.getElementById('landing-page-section'),
        menuContainer: document.getElementById('menu-container'),
        logoWhiteBackground: document.getElementById('logo-white-background'),
        profilePictureMaskRect: document.getElementById('about-profile-picture-mask-rect'),
    }

    items = [
        {
            name: 'home',
            elements: [
                document.querySelectorAll('.menu-item')[0]
            ],
        },
        {
            name: 'about',
            elements: [
                document.querySelectorAll('.menu-item')[1]
            ],
            onOpen: () => this.experience.ui.about.animations.playHologramAnimation(.1)
        },
        {
            name: 'work',
            elements: [
                document.querySelectorAll('.menu-item')[2]
            ],
        },
        {
            name: 'contact',
            elements: [
                document.querySelectorAll('.menu-item')[3],
                document.getElementById('landing-cta-button')
            ],
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.transition = this.experience.ui.transition
        this.scrollIcon = this.experience.ui.scrollIcon
        this.landingPage = this.experience.ui.landingPage
        this.scroll = this.experience.ui.scroll
        this.renderer = this.experience.renderer
        this.waypoints = this.experience.waypoints
        this.character = this.experience.world.character
        this.menu = this.experience.ui.menu.main
        this.background = this.experience.world.background
        this.room = this.experience.world.landingPage.room.model
        this.sections = this.experience.ui.sections

        //Update active item on menu open
        this.menu.on('open', () => this.updateActiveItem())

        this.addClickEventListeners()
    }

    addClickEventListeners() {
        this.items.forEach((item) => {
            //Apply event listeners to all items (ex.: landing-cta-button + home-menu-button)
            item.elements.forEach((element) => {
                element.addEventListener('click', () => {
                    this.openItem(item)
                })
            })
        })
    }

    updateActiveItem() {
        if (this.landingPage.visible) {
            //Make home menu item active
            this.clearAllActiveItems()
            document.querySelectorAll('.menu-item')[0].classList.add('active-menu-item')
        } else {
            //Otherwise check which section is active based on scrollY
            this.items.forEach((item) => {
                if (item.name !== 'home') {
                    const sectionY = this.sections.sections.find((section) => section.name === item.name).y

                    if (this.scroll.scrollY + (window.innerHeight / 2) >= sectionY) {
                        this.clearAllActiveItems()
                        document.querySelectorAll('.menu-item')[this.items.indexOf(item)].classList.add('active-menu-item')
                        return
                    }
                }
            })
        }
    }

    clearAllActiveItems() {
        const allItems = document.querySelectorAll('.menu-item')

        allItems.forEach((item) => {
            item.classList.remove('active-menu-item')
        })
    }

    openItem(item) {
        //Clear all active items to make elements outside of menu clickable
        if (!this.menu.visible) this.clearAllActiveItems()

        if (!this.transition.isShowing && !item.elements[0].classList.contains('active-menu-item')) {
            //start transition
            this.transition.show()
            setTimeout(() => {
                this.transition.hide()

                //setup item
                this.setupItem(item)
            }, 700)
        }
    }

    setupItem(item) {
        //Hide Scroll Icon on Landing Page
        this.scrollIcon.hide()

        if (item.onOpen) item.onOpen()

        // setup either scroll or landing page item
        item.name != 'home' ? this.setupScrollContainerItem(item) : this.setupLandingPage()
    }

    setupLandingPage() {
        this.landingPage.visible = true

        this.waypoints.moveToWaypoint('landing-page', false)

        //Room
        this.room.scale.set(1, 1, 1)

        //Character
        this.character.model.position.y = -5.7
        this.character.animation.play('idle', 0)
        this.character.updateWireframe('up')
        this.character.body.face.material.map = this.character.body.faceTextures.default

        //Character Mouse
        this.experience.world.landingPage.mouse.moveToIdleStartPositon()

        //Move Landing Page and Scroll Container to positions
        this.moveWithoutTransition(this.domElements.landingPage, 'top', '0')
        this.moveWithoutTransition(this.domElements.scrollContainer, 'top', '100%')
        gsap.to(this.domElements.scrollContainer, { y: 0, duration: 0 })

        this.renderer.instance.setClearColor('#F5EFE6')

        //Lab Background
        this.background.material.uniforms.uOffset.value = -this.background.height

        //Fog
        gsap.to(this.experience.scene.fog, { near: 15, far: 20, duration: 0 })

        //Logo white background
        gsap.to(this.domElements.logoWhiteBackground, { y: 0, duration: 0 })

        //Hide menu without animation
        this.instantHideMenu()

        //Reset scroll y
        this.scroll.scrollY = 0
    }

    setupScrollContainerItem(item) {
        this.landingPage.visible = false

        this.waypoints.moveToWaypoint('scroll-start', false)

        //Character
        this.character.model.position.y = -14.95
        this.character.animation.play('waterIdle', 0)
        this.character.updateWireframe('down')


        //Move Landing Page and Scroll Container to positions
        this.moveWithoutTransition(this.domElements.landingPage, 'top', '-100%')
        this.moveWithoutTransition(this.domElements.scrollContainer, 'top', '0')

        this.renderer.instance.setClearColor('#EFE7DC')

        //Hide menu without animation
        this.instantHideMenu()

        //set scrollY to section's Y-position and perform instant-scroll
        this.scroll.scrollY = this.sections.sections.find((section) => section.name === item.name).y
        this.scroll.performScroll(0)
    }

    instantHideMenu() {
        this.menu.visible = false

        //Button
        this.menu.resetMenuButton()
        
        //Content positions
        this.moveWithoutTransition(this.domElements.scrollContainer, 'left', '0')
        this.moveWithoutTransition(this.domElements.landingPageContent, 'left', '0')
        this.moveWithoutTransition(this.domElements.menuContainer, 'right', 'calc(-350px - 10vw)')
    }

    moveWithoutTransition(element, style, value) {
        element.classList.add('no-transition')
        element.style[style] = value
        element.offsetHeight

        setTimeout(() => {
            element.classList.remove('no-transition')
        })
    }
}