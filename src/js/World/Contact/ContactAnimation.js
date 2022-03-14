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
        this.character.model.position.y = this.experience.world.contact.scene.model.position.y + 0.2
        this.character.setAllToOriginal()
        this.character.body.face.material.map = this.character.body.faceTextures.default
        this.character.animation.play('contact', 0)


        gsap.to(this.david.material, { opacity: 1, duration: 1.7, delay: 1.6 })

        this.character.body.head.material.transparent = true
        this.character.body.head.material.needsUpdate = true
        this.character.body.face.renderOrder = 1

        this.character.model.children[0].children.forEach((child) => {
            if (child.material) {
                gsap.to(child.material, { opacity: 0, duration: 1.7, delay: 1.5 })
            }
        })
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