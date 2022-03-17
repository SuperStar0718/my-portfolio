import gsap from 'gsap'
import Experience from '../../Experience.js'
import Animations from './Animations.js'
import Body from './Body.js'

export default class Character {

    leftDesktopIntervalDuration = 12

    constructor() {
        // Define 
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.room = this.experience.world.landingPage.room
        this.mouse = this.experience.world.landingPage.mouse
        this.messagePopUp = this.experience.world.landingPage.messagePopUp
        this.desktops = this.experience.world.landingPage.desktops
        this.sounds = this.experience.sounds

        // debug 
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Character').close()
        }

        // resources 
        this.resource = this.resources.items.characterModel
        this.faceResource = this.resources.items.characterFaceModel

        setTimeout(() => this.playWaveAnimation(), 1100)

        this.setModel()
        this.preloadWireframe()

        if (this.debug.active) {
            this.initDebug()
        }
    }

    setModel() {
        this.model = this.resource.scene

        this.model.rotation.y = -Math.PI / 2
        this.model.position.y -= 5.7

        this.scene.add(this.model)

        this.animation = new Animations(this.model)
        this.body = new Body(this.model)
    }

    preloadWireframe() {
        this.body.head.material = this.body.materials.wireframeMaterial
        setTimeout(() => this.body.head.material = this.body.materials.bakedMaterial)
    }

    // ------------------------ ANIMATIONS ---------------------------------------------------------------------------------------------- 
    // play wave animation when loading-transition is done

    // change to idle afterwards using timeout
    playWaveAnimation() {
        // animation 
        this.animation.play('wave')

        //Idle afterwards
        setTimeout(() => this.idle(), (this.animation.actions.wave._clip.duration - .23) * 1000)

        // faces 
        gsap.delayedCall(.1, () => {
            this.body.updateFace('smile')
        })

        gsap.delayedCall(this.animation.actions.wave._clip.duration - .6, () => {
            if (this.experience.ui.landingPage.visible)
                this.body.updateFace('default')
        })
    }

    // play idle animation and start scroll and left desktop action interval
    idle() {
        this.animation.play('idle')

        // start intervals 
        this.scrollInterval()
        this.leftDesktopInterval()
    }

    // scroll desktop 0 if idle is playing
    // repeat interval afterwards
    scrollInterval() {
        //Start delayed call
        this.scrollIntervalCall = gsap.delayedCall((Math.random() * 2) + 3, () => {
            if (this.experience.ui.landingPage.visible) {
                if (this.animation.actions.current._clip.name == 'idle') {
                    //Scroll
                    this.desktops.scrollDesktop0()

                    //Perform double scroll
                    if (Math.random() <= 0.33) {
                        setTimeout(() => this.desktops.scrollDesktop0(), 700)
                    }
                }
            }
            //Repeat
            this.scrollInterval()
        })
    }

    // play left desktop action, show message pop up in room and repeat interval afterwards 
    leftDesktopInterval() {
        this.leftDesktopIntervalCall = gsap.delayedCall(this.leftDesktopIntervalDuration + this.animation.actions.leftDesktopAction._clip.duration + (Math.random() * 4), () => {
            if (this.experience.ui.landingPage.visible) {
                //Animation
                gsap.delayedCall(.18, () => this.animation.play('leftDesktopAction', .3))

                //Pop Up Animation
                this.messagePopUp.show()

                //Type sound
                setTimeout(() => this.sounds.play('longKeyboard'), 1700)

                // play idle afterwards 
                gsap.delayedCall(this.animation.actions.leftDesktopAction._clip.duration, () => {
                    this.animation.play('idle', .35)
                })
            }
            this.leftDesktopInterval()
        })
    }

    // ------------------------ MISC ---------------------------------------------------------------------------------------------- 

    update() {
        if (this.experience.ui.landingPage.visible && (this.animation.actions.current._clip.name === 'idle' || this.animation.actions.current._clip.name === 'left-desktop-action'))
            this.mouse.updateMouseSync()

        this.animation.update()

        // Check for wireframe material 
        if (this.checkForWireframe) {
            this.updateWireframe(this.checkForWireframe)
        }
    }

    // ------------------------ Scene 1 Transition Materials ---------------------------------------------------------------------------------------------- 
    updateWireframe(direction) {
        // check each children of model 
        this.model.children[0].children.forEach((children) => {
            if (children.wireframeAt) {
                if (direction == 'up' && this.model.position.y > children.wireframeAt - 5.7) {
                    this.updateToOriginalMaterial(children)
                } else if (this.model.position.y < children.wireframeAt - 5.7) {
                    this.updateToWireframeMaterial(children)
                }
            }
        })
    }

    updateToOriginalMaterial(children) {
        if (children.name === 'face') {
            // Show face and update
            children.visible = true
        } else {
            // update children to original material 
            children.material = children.originalMaterial
        }
    }

    updateToWireframeMaterial(children) {
        if (children.name === 'face') {
            // hide face 
            children.visible = false
        } else {
            // set original material to retrieve for scroll back up 
            if (!children.originalMaterial) {
                children.originalMaterial = children.material
            }

            children.material = this.body.materials.wireframeMaterial
        }
    }

    setAllToOriginal() {
        this.model.children[0].children.forEach((children) => {
            if (children.name === 'face')
                children.visible = true

            if (children.originalMaterial)
                children.material = children.originalMaterial
        })
    }

    initDebug() {
        this.paramters = {
            scale: 1
        }

        this.debugFolder.add(this.model.position, 'y').min(-50).max(10)
        this.debugFolder.add(this.paramters, 'scale').min(0.5).max(3).name('Scale').onChange(() => {
            this.model.scale.set(this.paramters.scale, this.paramters.scale, this.paramters.scale)
        })
    }
}