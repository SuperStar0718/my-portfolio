import { gsap, Power3 } from "gsap"
import Experience from "../Experience"

export default class HoverIcon {

    domElements = {
        icon: document.getElementById('hover-icon'),
        content: document.getElementById('hover-content'),
        colorSwitchContainer: document.getElementById('hover-icon-color-switch'),
        aboutSection: document.getElementById('about-section')
    }

    hoverElements = [
        {
            class: '.menu-item',
            type: 'circle',
            color: '#FF923E',
        },
        {
            class: '.work-item-gray-button',
            type: 'pointer',
            color: '#091434',
        },
        {
            class: '.small-button',
            type: 'pointer',
            color: '#091434',
        },
        {
            class: '#landing-cta-button',
            type: 'pointer',
            color: '#091434',
        },
        {
            class: '#landing-cta-button',
            type: 'pointer',
            color: '#091434',
        },
        {
            class: '#logo-click-container',
            type: 'pointer',
            color: '#CCCCCC',
        },
        {
            class: '.overlay-button',
            type: 'pointer',
            color: '#091434',
        },
        {
            class: '.social-icon',
            type: 'pointer',
            color: '#CCCCCC',
        },
        {
            class: '.work-navigation-button',
            type: 'pointer',
            color: '#091434',
        },
        {
            class: '.work-item-container',
            type: 'pointer',
            color: '#091434',
        },
        {
            class: '.menu-legal-link',
            type: 'pointer',
            color: '#091434',
        },
    ]

    currentBaseColor = '#FF923E'
    cursorIsInsideDoc = true

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scroll = this.experience.ui.scroll
        this.landingPage = this.experience.ui.landingPage

        this.setupDefault()
        this.setCursorLeavesDoc()
        this.setHoverColorSwitchHeight()
        this.applyEventListeners()
        this.applyColorSwitchEventListeners()

        //Fade In
        gsap.fromTo(this.domElements.icon, { opacity: 0 }, { opacity: 1, delay: 1.6 })

        //Visbility on touch devices
        this.sizes.touch ? this.domElements.icon.classList.add('hide') : this.domElements.icon.classList.remove('hide')
        this.sizes.on('touch', () => this.domElements.icon.classList.add('hide'))
        this.sizes.on('no-touch', () => this.domElements.icon.classList.remove('hide'))

    }

    setCursorLeavesDoc() {
        document.addEventListener('mouseleave', () => this.cursorIsInsideDoc = false)
        document.addEventListener('mouseenter', () => this.cursorIsInsideDoc = true)
    }

    // Apply Mouseenter, mouseleave and mousemove event listeners
    applyEventListeners() {
        this.hoverElements.forEach((element) => {
            const domElements = document.querySelectorAll(element.class)

            for (let i = 0; i < domElements.length; i++) {
                const domElement = domElements[i]

                // Mouseeenter 
                domElement.addEventListener('mouseenter', () => {
                    if (!this.sizes.touch) element.type == 'pointer' ? this.setupPointer(element, domElement) : this.setupCircle(element, domElement)
                })

                // mouseleave 
                domElement.addEventListener('mouseleave', () => {
                    if (!this.sizes.touch) this.setupDefault()
                })
            }
        })

        // mouse move 
        window.addEventListener('mousemove', () => this.updatePosition())
    }

    updatePosition() {
        if (!this.sizes.touch)
            gsap.to(this.domElements.icon, { x: event.pageX, y: event.pageY, duration: .4, ease: Power3.easeOut })
    }

    applyColorSwitchEventListeners() {
        //Color switch container (margin left and right of about section)
        this.domElements.colorSwitchContainer.addEventListener('mouseenter', () => this.updateBaseColor('#34bfff'))
        this.domElements.colorSwitchContainer.addEventListener('mouseleave', () => this.updateBaseColor('#FF923E'))
        this.domElements.colorSwitchContainer.addEventListener('mousemove', () => this.updateBaseColor('#34bfff'))

        //about section
        this.domElements.aboutSection.addEventListener('mouseenter', () => this.updateBaseColor('#34bfff'))
        this.domElements.aboutSection.addEventListener('mouseleave', () => this.updateBaseColor('#FF923E'))
        this.domElements.aboutSection.addEventListener('mousemove', () => this.updateBaseColor('#34bfff'))
    }

    updateBaseColor(color) {
        setTimeout(() => {
            if (!document.hidden && (this.cursorIsInsideDoc || this.landingPage.visible) && this.currentBaseColor != color) {
                this.currentBaseColor = color

                if (this.currentIcon == 'default')
                    this.domElements.icon.style.borderColor = this.currentBaseColor
            }
        })
    }

    setupDefault() {
        this.currentIcon = 'default'

        this.domElements.icon.style.borderWidth = '7px'
        this.domElements.icon.style.height = '0'
        this.domElements.icon.style.width = '0'
        this.domElements.icon.style.borderColor = this.currentBaseColor
        this.domElements.content.classList.add('hide')
    }

    setupPointer(element, domElement) {

        const isInactiveWorkItem = element.class == '.work-item-container' ? domElement.classList.contains('work-inactive-item-container') : true
        const isntDisabledWorkNavigationButton = !domElement.classList.contains('work-disabled-navigation-button')

        if (isInactiveWorkItem && isntDisabledWorkNavigationButton) {
            setTimeout(() => {
                this.currentIcon = 'pointer'

                this.domElements.icon.style.borderWidth = '5px'
                this.domElements.icon.style.height = '18px'
                this.domElements.icon.style.width = '18px'
                this.domElements.icon.style.borderColor = element.color
                this.domElements.icon.style.background = 'transparent'
                this.domElements.content.classList.add('hide')
            })
        }
    }

    setupCircle(element, domElement) {
        if (!domElement.classList.contains('active-menu-item')) {
            this.currentIcon = 'circle'

            this.domElements.icon.style.borderWidth = '0'
            this.domElements.icon.style.height = '55px'
            this.domElements.icon.style.width = '55px'
            this.domElements.icon.style.background = element.color
            this.domElements.content.classList.remove('hide')
        }
    }

    setHoverColorSwitchHeight() {
        this.domElements.colorSwitchContainer.style.height = this.scroll.aboutContainer.height + (window.innerHeight * (this.sizes.portrait ? 0.03 : 0.12)) + 'px'
    }

    resize() {
        this.setHoverColorSwitchHeight()
    }
}