import Experience from '../../Experience'
import { gsap } from 'gsap'

export default class MenuItems {

    domElements = {
        scrollContainer: document.getElementById('scroll-container'),
        landingPage: document.getElementById('landing-page'),
        landingPageContent: document.getElementById('landing-page-section'),
        menuContainer: document.getElementById('menu-container'),
        logoWhiteBackground: document.getElementById('logo-white-background'),
    }

    items = [
        {
            name: 'home',
            elements: [
                document.querySelectorAll('.menu-item')[0]
            ],
            y: 'landing',
        },
        {
            name: 'about',
            elements: [
                document.querySelectorAll('.menu-item')[1]
            ],
            y: 0,
        },
        {
            name: 'work',
            elements: [
                document.querySelectorAll('.menu-item')[2]
            ],
            y: 500,
        },
        {
            name: 'contact',
            elements: [
                document.querySelectorAll('.menu-item')[3],
                document.getElementById('landing-cta-button')
            ],
            y: 1000,
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

        this.addClickEventListeners()
    }

    addClickEventListeners() {
        this.items.forEach((item) => {
            item.elements.forEach((element) => {
                element.addEventListener('click', () => {
                    this.openItem(item)
                })
            })
        })
    }

    openItem(item) {
        //transition
        this.transition.show()
        setTimeout(() => {
            this.transition.hide()
            this.setupItem(item)
        }, 700)
    }

    setupItem(item) {
        this.scrollIcon.hide()

        item.y != 'landing' ? this.setupScrollContainerItem(item) : this.setupLandingPage()
    }

    setupLandingPage() {
        this.landingPage.visible = true

        this.waypoints.moveToWaypoint('landing-page', false)

        this.room.scale.set(1, 1, 1)

        this.character.model.position.y = -5.7
        this.character.animation.play('idle', 0)
        this.character.updateWireframe('up')
        this.character.body.face.material.map = this.character.body.faceTextures.default

        this.experience.world.landingPage.mouse.moveToIdleStartPositon()

        this.moveWithoutTransition(this.domElements.landingPage, 'top', '0')
        this.moveWithoutTransition(this.domElements.scrollContainer, 'top', '100%')
        gsap.to(this.domElements.scrollContainer, { y: 0, duration: 0 })

        this.renderer.instance.setClearColor('#F5EFE6')

        this.background.material.uniforms.uOffset.value = -2.3

        gsap.to(this.experience.scene.fog, { near: 15, far: 20, duration: 0 })

        gsap.to(this.domElements.logoWhiteBackground, { y: 0, duration: 0 })

        this.instantHideMenu()

        this.scroll.scrollY = 0
    }

    setupScrollContainerItem(item) {
        this.landingPage.visible = false

        this.waypoints.moveToWaypoint('scroll-start', false)

        this.character.model.position.y = -14.95
        this.character.animation.play('waterIdle', 0)
        this.character.updateWireframe('down')

        this.moveWithoutTransition(this.domElements.landingPage, 'top', '-100%')
        this.moveWithoutTransition(this.domElements.scrollContainer, 'top', '0')

        this.renderer.instance.setClearColor('#EFE7DC')

        this.instantHideMenu()

        this.scroll.scrollY = item.y
        this.scroll.performScroll()
    }

    instantHideMenu() {
        this.menu.visible = false
        this.menu.resetMenuButton()
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