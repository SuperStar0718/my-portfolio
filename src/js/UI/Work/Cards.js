import Experience from '../../Experience.js'
import { gsap, Back } from 'gsap'

export default class WorkCards {
    positionStyles = [
        'transform: translateX(-410%) scale(0.9);',// Left
        'transform: translateX(-310%) scale(0.9); ',
        'transform: translateX(-210%) scale(0.9);',
        'transform: translateX(-110%) scale(0.9); ',
        'transform: translateX(0%);', //Active
        'transform: translateX(110%) scale(0.9);', // Right
        'transform: translateX(210%) scale(0.9)',
        'transform: translateX(310%) scale(0.9);',
        'transform: translateX(410%) scale(0.9);',
    ]

    domElements = {
        section: document.getElementById('work-section'),
        backButton: document.getElementById('work-back-button'),
        nextButton: document.getElementById('work-next-button'),
    }

    currentItemIndex = 2

    constructor() {
        this.experience = new Experience()
        this.gestures = this.experience.gestures
        this.render = this.experience.ui.work.render
        this.sounds = this.experience.sounds

        this.addButtonEventListeners()
        this.initSwipes()
        this.updatePositions()
    }

    addButtonEventListeners() {
        // back button event listener
        this.domElements.backButton.addEventListener('click', () => this.moveBack())

        // next button event listener
        this.domElements.nextButton.addEventListener('click', () => this.moveForward())
    }

    initSwipes() {
        this.gestures.on('swipe-right', () => this.swipe('right'))
        this.gestures.on('swipe-left', () => this.swipe('left'))

        //Check if the current element is focused during swipe
        this.domElements.section.addEventListener('touchend', () => {
            setTimeout(() => this.isCurrentSwipeElement = false)
        })
        this.domElements.section.addEventListener('touchstart', () => {
            this.isCurrentSwipeElement = true
        })
    }

    swipe(direction) {
        if (this.isCurrentSwipeElement)
            direction == 'right' ? this.moveForward() : this.moveBack()
    }

    moveBack() {
        if (this.currentItemIndex != 4 && !this.itemsAreMoving) {
            this.currentItemIndex++
            this.updatePositions()
            this.sounds.play('buttonClick')
        }
    }

    moveForward() {
        if (this.currentItemIndex != 0 && !this.itemsAreMoving) {
            this.currentItemIndex--
            this.updatePositions()
            this.sounds.play('buttonClick')
        }
    }

    updatePositions() {
        this.render.items.forEach((item) => {
            const index = this.render.items.indexOf(item)

            //update position style
            document.getElementById('work-item-' + item.id).style = this.positionStyles[index + this.currentItemIndex]

            //update style class
            if (index + this.currentItemIndex != 4) {
                document.getElementById('work-item-' + item.id).classList.add('work-inactive-item-container')
            } else {
                document.getElementById('work-item-' + item.id).classList.remove('work-inactive-item-container')
            }
        })

        //prevent too fast switching
        this.itemsAreMoving = true
        gsap.delayedCall(.4, () => this.itemsAreMoving = false)

        this.updateNavigation()
    }

    // disable or enable back and next navigation buttons
    updateNavigation() {
        if (this.currentItemIndex == 0) {
            this.domElements.nextButton.classList.add('work-disabled-navigation-button')
            this.experience.ui.hoverIcon.setupDefault()
        } else if (this.currentItemIndex == 4) {
            this.domElements.backButton.classList.add('work-disabled-navigation-button')
            this.experience.ui.hoverIcon.setupDefault()
        } else {
            this.domElements.nextButton.classList.remove('work-disabled-navigation-button')
            this.domElements.backButton.classList.remove('work-disabled-navigation-button')
        }
    }
}