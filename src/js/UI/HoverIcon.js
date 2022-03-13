import { gsap, Power2 } from "gsap"
import Experience from "../Experience"

export default class HoverIcon {

    icon = document.getElementById('hover-icon')
    hoverElements = [
        {
            class: '.menu-item',
        },
        {
            class: '.work-item-gray-button',
        },
        {
            class: '.small-button',
        },
        {
            class: '#landing-cta-button',
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.applyEventListeners()
    }

    // Apply Mouseenter, mouseleave and mousemove event listeners
    applyEventListeners() {
        this.hoverElements.forEach((element) => {
            const domClass = document.querySelectorAll(element.class)

            for (let i = 0; i < domClass.length; i++) {
                const domElement = domClass[i]

                // Mouseeenter 
                domElement.addEventListener('mouseenter', () => {
                    this.showIcon(event.srcElement)
                })

                // mouseleave 
                domElement.addEventListener('mouseleave', () => {
                    this.hideIcon(event.srcElement)
                })
            }
        })

        // mouse move 
        window.addEventListener('mousemove', () => {
            // update hover icon position if isHovering 
            if (this.isHovering) {
                gsap.to(this.icon, { x: event.pageX, y: event.pageY, duration: .6, ease: Power2.easeOut })
            }
        })
    }

    showIcon(element) {
        const isActiveMenuItem = element.classList.contains('active-menu-item')
        const isActiveAboutTab = element.classList.contains('about-active-tab')
        const isActiveWorkItemChildren = !element.parentElement.parentElement.parentElement.parentElement.classList.contains('work-inactive-item-container')
        const isTouch = this.sizes.touch

        if (!isActiveMenuItem && !isActiveAboutTab && isActiveWorkItemChildren && !isTouch) {
            this.currentHoverElement = element

            this.userLeftElement = false
            this.isHovering = true

            // animate 
            if (this.closeScaleAnimation) this.closeScaleAnimation.kill()

            this.openScaleAnimation = gsap.fromTo(this.icon, { scale: 0 }, { scale: 1, duration: .2 })
            gsap.to(this.icon, { x: event.pageX, y: event.pageY, duration: 0 })
        }
    }

    hideIcon(element) {
        // animate
        if (this.openScaleAnimation) this.openScaleAnimation.kill()

        this.closeScaleAnimation = gsap.to(this.icon, { scale: 0, duration: .2 })

        this.userLeftElement = true

        // update hovering state 
        gsap.delayedCall(.2, () => {
            if (this.currentHoverElement == element && this.userLeftElement) {
                this.isHovering = false
            }
        })
    }
}