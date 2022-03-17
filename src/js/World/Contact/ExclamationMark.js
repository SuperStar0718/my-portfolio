
import Experience from '../../Experience'
import { gsap, Power4 } from 'gsap'
import * as THREE from 'three'

export default class ExclamationMark {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.contactScene = this.experience.world.contact.scene

        this.setSprite()
    }

    // create and position message pop up 
    setSprite() {
        this.material = new THREE.SpriteMaterial({ map: this.resources.items.exclamationMarkSprite, alphaTest: 0.1, opacity: 0, fog: false })

        this.sprite = new THREE.Sprite(this.material)

        this.contactScene.model.add(this.sprite)

        this.sprite.position.set(-0.55, 4.2, -0.5)
        this.sprite.scale.set(0.5, 0.5, 0.5)
    }

    show() {
        //animation
        gsap.fromTo(this.sprite.position, { y: 3.3}, { y: 5, duration: 1, ease: Power4.easeOut })
        gsap.fromTo(this.material, { opacity: 0 }, { opacity: 1, duration: .1 })
        gsap.fromTo(this.material, { opacity: 1 }, { opacity: 0, duration: .2, delay: .8 })
    }
}