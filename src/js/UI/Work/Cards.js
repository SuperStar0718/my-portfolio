import Experience from '../../Experience.js'
import { gsap, Back} from 'gsap'

export default class WorkCards {
    positionStyles = [
        'transform: translateX(-410%) scale(0.9);',// Left
        'transform: translateX(-310%) scale(0.9); ',
        'transform: translateX(-210%) scale(0.9);',
        'transform: translateX(-110%) scale(0.9); ',
        'transform: translateX(0%);', //Active
        'transform: translateX(110%) scale(0.9);', // Right
        'transform: translateX(210%) scale(0.9)',
        'transform: translateX(310%) scale(0.9); ',
        'transform: translateX(410%) scale(0.9);',
    ]

    backButton = document.getElementById('work-back-button')
    nextButton = document.getElementById('work-next-button')

    constructor() {
        this.experience = new Experience()
        this.gestures = this.experience.gestures
        this.render = this.experience.ui.work.render
        this.debug = this.experience.debug

        if(this.debug.active) {
            this.initDebug()
        }

        this.currentItemIndex = 2

        this.addButtonEventListeners()
        this.initSwipes()
        this.updatePositions()
    }

    addButtonEventListeners() {
        // back button event listener
        this.backButton.addEventListener('click', () => {
            this.moveBack()
        })

        // next button event listener
        this.nextButton.addEventListener('click', () => {
            this.moveForward()
        })
    }

    initSwipes() {
        this.gestures.on('scroll-right', () => this.moveForward())
        this.gestures.on('scroll-left', () => this.moveBack())
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
            this.nextButton.classList.add('work-disabled-navigation-button')
        } else if (this.currentItemIndex == 4) {
            this.backButton.classList.add('work-disabled-navigation-button')
        } else {
            this.nextButton.classList.remove('work-disabled-navigation-button')
            this.backButton.classList.remove('work-disabled-navigation-button')
        }
    }

    playOpenAnimation() {
        gsap.fromTo(document.querySelectorAll('.work-item-container')[2], {scale: 0}, {scale: 1, ease: Back.easeOut.config(1.5)})
    }

    initDebug() {
        this.debugFolder = this.debug.ui.addFolder('Work UI')

        const debugObject = {
            playOpenAnimation: () => { this.playOpenAnimation() },
        }
        
        this.debugFolder.add(debugObject, 'playOpenAnimation').name('Play Open Animation')
    }
}