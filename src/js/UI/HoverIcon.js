import { gsap, Power2, Back } from "gsap"
import Experience from "../Experience"

export default class HoverIcon {

    icon = document.getElementById('hover-icon')
    hoverElements = [
        {
            class: '.menu-item',
            color: '#FF923E',
        },
        {
            class: '.work-item-gray-button',
            color: '#105099',
        },
        {
            class: '.small-button',
            color: '#105099',
        },
        {
            class: '#landing-cta-button',
            color: '#105099',
        },
        {
            class: '#landing-more-about-me',
            color: '#105099',
        }
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

                    this.icon.style.background = element.color
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
                gsap.to(this.icon, { x: event.pageX, y: event.pageY, duration: .5 })
            }
        })
    }

    showIcon(element) {
        const isActiveMenuItem = element.classList.contains('active-menu-item')
        const isTouch = this.sizes.touch

        if (!isActiveMenuItem && !isTouch) {
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