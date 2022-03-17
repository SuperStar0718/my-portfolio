import Experience from '../../Experience'
import { gsap, Power2 } from 'gsap'

export default class ContactAnimation {

    played = false

    parameters = {
        transitionDuration: 3
    }

    constructor() {
        this.experience = new Experience()
        this.character = this.experience.world.character
        this.debug = this.experience.debug
        this.contactScene = this.experience.world.contact.scene
        this.david = this.experience.world.contact.david
        this.exclamationMark = this.experience.world.contact.exclamationMark

        this.setMaterialsToHide()
    }

    playIdle() {
        if (!this.played) {
            this.character.model.position.y = this.experience.world.contact.scene.model.position.y + 0.2
            this.character.setAllToOriginal()
            this.character.body.face.material.map = this.character.body.faceTextures.default
            this.character.animation.play('standingIdle', 0)
        }
    }

    playTransition() {
        if (!this.played) {
            this.timeline = gsap.timeline()
            this.played = true

            this.exclamationMark.show()

            gsap.delayedCall(.2, () => this.character.animation.play('contact', .3), 0)

            this.transtionDelay = gsap.delayedCall(1.2, () => {
                this.startedTransition = true

                this.timeline.to(this.david.material, { opacity: 1, duration: this.parameters.transitionDuration, ease: Power2.easeInOut }, 0)

                this.character.body.materials.bakedMaterial.transparent = true
                this.character.body.materials.bakedMaterial.needsUpdate = true
                this.character.body.face.renderOrder = 1

                this.materialsToHide.forEach((material) => {
                    this.timeline.to(material, { opacity: 0, duration: this.parameters.transitionDuration, ease: Power2.easeInOut }, 0)
                })

                setTimeout(() => this.resetCharacter, this.parameters.transitionDuration)
            })
        }
    }

    resetCharacter() {
        if (this.character.body.materials.bakedMaterial.transparent || this.materialsToHide[0].opacity != 1 || !this.startedTransition) {
            //Move character back into tube
            if (!this.experience.ui.landingPage.visible) {
                this.experience.ui.about.animations.resetCharacterToPosition()
            }

            //Rest head
            this.character.body.materials.bakedMaterial.transparent = false
            this.character.body.materials.bakedMaterial.needsUpdate = true
            this.character.body.face.renderOrder = 0

            //Show all materials
            this.materialsToHide.forEach((material) => {
                material.opacity = 1
            })

            //Clear gsap
            if (this.timeline) this.timeline.kill()
            if (this.transtionDelay) this.transtionDelay.kill()

            //Show David if not visible yet
            if (this.david.material.opacity != 1 && this.played) 
                gsap.to(this.david.material, { opacity: 1, duration: this.parameters.transitionDuration, ease: Power2.easeInOut }, 0)
        }
    }

    setMaterialsToHide() {
        this.materialsToHide = [
            this.character.body.materials.shirtMaterial,
            this.character.body.materials.skinMaterial,
            this.character.body.materials.pantsMaterial,
            this.character.body.materials.whiteMaterial,
            this.character.body.materials.bakedMaterial,
            this.character.body.face.material
        ]
    }
} 