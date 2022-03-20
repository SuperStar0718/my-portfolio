import Experience from '../../Experience.js'
import { gsap, Back} from 'gsap'

export default class WorkCards {
    positionStyles = [
        'transform: translateX(-430%);',// Left
        'transform: translateX(-325%); ',
        'transform: translateX(-220%);',
        'transform: translateX(-110%); ',
        'transform: translateX(0%);', //Active
        'transform: translateX(110%);', // Right
        'transform: translateX(220%)',
        'transform: translateX(325%);',
        'transform: translateX(430%);',
    ]

    domElements = {
        section: document.getElementById('work-section'),
        backButton: document.getElementById('work-back-button'),
        nextButton: document.getElementById('work-next-button'),
    }

    constructor() {
        this.experience = new Experience()
        this.gestures = this.experience.gestures
        this.render = this.experience.ui.work.render

        this.currentItemIndex = 2

        this.addButtonEventListeners()
        this.initSwipes()
        this.updatePositions()
    }

    addButtonEventListeners() {
        // back button event listener
        this.domElements.backButton.addEventListener('click', () => {
            this.moveBack()
        })

        // next button event listener
        this.domElements.nextButton.addEventListener('click', () => {
            this.moveForward()
        })
    }

    initSwipes() {
        this.gestures.on('swipe-right', () => this.swipe('right'))
        this.gestures.on('swipe-left', () => this.swipe('left'))

        this.domElements.section.addEventListener('touchend', () => {
            setTimeout(() => this.isCurrentSwipeElement = false)
        })
        this.domElements.section.addEventListener('touchstart', () => {
            this.isCurrentSwipeElement = true
        })
    }

    swipe(direction) {
        if(this.isCurrentSwipeElement) {
            direction == 'right' ? this.moveForward() : this.moveBack()
        }
    }

    moveBack() {
        if (this.currentItemIndex != 4 && !this.itemsAreMoving) {
            this.currentItemIndex++
            this.updatePositions()
        }
    }

    moveForward() {
        if (this.currentItemIndex != 0 && !this.itemsAreMoving) {
            this.currentItemIndex--
            this.updatePositions()
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
        setTimeout(() => this.itemsAreMoving = false, 400)

        this.updateNavigation()
    }

    // disable or enable back and next navigation buttons
    updateNavigation() {
        if (this.currentItemIndex == 0) {
            this.domElements.nextButton.classList.add('work-disabled-navigation-button')
        } else if (this.currentItemIndex == 4) {
            this.domElements.backButton.classList.add('work-disabled-navigation-button')
        } else {
            this.domElements.nextButton.classList.remove('work-disabled-navigation-button')
            this.domElements.backButton.classList.remove('work-disabled-navigation-button')
        }
    }
}