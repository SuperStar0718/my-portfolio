import Experience from '../../Experience'
import { gsap, Power2 } from 'gsap'

export default class ContactAnimation {
    constructor() {
        this.experience = new Experience()
        this.character = this.experience.world.character
        this.debug = this.experience.debug
        this.contactScene = this.experience.world.contact.scene
        this.david = this.experience.world.contact.david

        this.initDebug()
    }

    playAnimation() {
        this.character.model.position.y = this.experience.world.contact.scene.model.position.y
        this.character.setAllToOriginal()
        this.character.body.face.material.map = this.character.body.faceTextures.default
        this.character.animation.play('contact', 0)

        this.david.material.opacity = 0
        gsap.to(this.david.material, { opacity: 1, delay: 1.3 })

        gsap.to(this.character.model.scale, { x: 0, y: 0, z: 0, duration: 1.2, delay: 1.5 })
    }

    initDebug() {
        if (this.debug.active) {
            //Set folder
            this.debugFolder = this.experience.world.contact.scene.debugFolder

            const debugObject = {
                playAnimation: () => { this.playAnimation() },
            }

            this.debugFolder.add(debugObject, 'playAnimation').name('Play Animation')
        }
    }
} 