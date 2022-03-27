import Experience from '../../Experience'
import { gsap, Power3 } from 'gsap'

export default class ContactAnimation {

    played = false

    parameters = {
        transitionDuration: 3,
        characterPortraitY: .5,
        characterLandscapeY: 0.27,
        characterPortraitScale: 1.7
    }

    constructor() {
        this.experience = new Experience()
        this.character = this.experience.world.character
        this.debug = this.experience.debug
        this.contactScene = this.experience.world.contact.scene
        this.david = this.experience.world.contact.david
        this.exclamationMark = this.experience.world.contact.exclamationMark
        this.sizes = this.experience.sizes

        this.setMaterialsToHide()
    }

    playIdle() {
        if (!this.played) {
            //Position
            this.character.model.position.y = this.experience.world.contact.scene.model.position.y + this.parameters[this.sizes.portrait ? 'characterPortraitY' : 'characterLandscapeY']

            //scale
            if (this.sizes.portrait) this.character.model.scale.set(this.parameters.characterPortraitScale, this.parameters.characterPortraitScale, this.parameters.characterPortraitScale)

            this.character.setAllToOriginal()
            this.character.body.face.material.map = this.character.body.faceTextures.sleepy
            this.character.animation.play('standingIdle', 0)
        }
    }

    playTransition() {
        if (!this.played) {
            this.timeline = gsap.timeline()

            setTimeout(() => {
                this.character.body.face.material.map = this.character.body.faceTextures.scared
                setTimeout(() => {
                    this.character.body.faceTransitions.current = null
                    this.character.body.updateFace('contact')
                }, 350)
            }, 200)

            this.played = true

            this.exclamationMark.show()

            gsap.delayedCall(.15, () => {
                if (this.character.animation.actions.current._clip.name === 'standing-idle')
                    this.character.animation.play('contact', .15)
            })

            this.transtionDelay = gsap.delayedCall(1, () => {
                this.startedTransition = true

                this.timeline.to(this.david.material, { opacity: 1, duration: this.parameters.transitionDuration, ease: Power3.easeIn }, 0)

                this.character.body.materials.bakedMaterial.transparent = true
                this.character.body.materials.bakedMaterial.needsUpdate = true
                this.character.body.face.renderOrder = 1

                this.materialsToHide.forEach((material) => {
                    this.timeline.to(material, { opacity: 0, duration: this.parameters.transitionDuration, ease: Power3.easeIn }, 0)
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

            this.character.model.scale.set(1, 1, 1)

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
                gsap.to(this.david.material, { opacity: 1, duration: this.parameters.transitionDuration, ease: Power3.easeIn }, 0)
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