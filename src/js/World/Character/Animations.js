import * as THREE from 'three'
import Experience from '../../Experience'

export default class Animations {
    constructor(model) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.chair = this.experience.world.landingPage.room.chair

        this.resource = this.resources.items.characterModel

        this.model = model

        // debug 
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.folders.find((folder) => folder._title === 'Character').addFolder('Animations').close()

            this.debugAnimations()
        }

        this.setAnimations()
    }

    setAnimations() {
        this.mixer = new THREE.AnimationMixer(this.model)

        this.defineActions()

        this.actions.current = this.actions.idle
    }

    defineActions() {
        this.actions = {}

        //Intro fall down action
        this.actions.introFallDown = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'intro-fall-down'))
        this.actions.introFallDown.repetitions = 1
        this.actions.introFallDown.clampWhenFinished = true
        this.actions.introFallDown.allowedOutsideLanding = false

        // Left desktop action 
        this.actions.leftDesktopAction = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'left-desktop-action'))
        this.actions.leftDesktopAction.repetitions = 1
        this.actions.leftDesktopAction.clampWhenFinished = true
        this.actions.leftDesktopAction.allowedOutsideLanding = false

        // idle action 
        this.actions.idle = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'idle'))
        this.actions.idle.loop = THREE.LoopPingPong
        this.actions.idle.allowedOutsideLanding = false

        // wave action 
        this.actions.wave = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'wave'))
        this.actions.wave.repetitions = 1
        this.actions.wave.clampWhenFinished = true
        this.actions.wave.allowedOutsideLanding = false

        // fall down action 
        this.actions.fallDown = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'fall-down'))
        this.actions.fallDown.repetitions = 1
        this.actions.fallDown.clampWhenFinished = true
        this.actions.fallDown.allowedOutsideLanding = true

        // water idle action 
        this.actions.waterIdle = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'water-idle'))
        this.actions.waterIdle.loop = THREE.LoopPingPong
        this.actions.waterIdle.allowedOutsideLanding = true

        //Contact scene action
        this.actions.contact = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'contact-animation'))
        this.actions.contact.repetitions = 1
        this.actions.contact.clampWhenFinished = true
        this.actions.contact.allowedOutsideLanding = true

        //contact scene idle action 
        this.actions.standingIdle = this.mixer.clipAction(this.resource.animations.find((animation) => animation.name === 'standing-idle'))
        this.actions.standingIdle.loop = THREE.LoopPingPong
        this.actions.standingIdle.allowedOutsideLanding = true
        this.actions.standingIdle.timeScale = 0.5
    }

    play(name, transitionDuration = .5) {
        const newAction = this.actions[name]
        const oldAction = this.actions.current

        if (!oldAction._clip.name != newAction._clip.name && (newAction.allowedOutsideLanding || this.experience.ui.landingPage.visible)) {

            newAction
                .reset()
                .play()

            oldAction.crossFadeTo(newAction, transitionDuration)

            this.actions.current = newAction
        } else if (this.debug.active) {
            console.log('Illegal animation.')
        }
    }

    debugAnimations() {
        const debugObject = {
            playIdle: () => { this.play('idle') },
            playOpening: () => { this.play('wave') },
            playLeftDesktopAction: () => { this.play('leftDesktopAction') },
            playWaterIdle: () => { this.play('waterIdle') },
        }
        
        this.debugFolder.add(debugObject, 'playIdle').name('Play Idle')
        this.debugFolder.add(debugObject, 'playOpening').name('Play Wave')
        this.debugFolder.add(debugObject, 'playLeftDesktopAction').name('Play Left Desktop')
        this.debugFolder.add(debugObject, 'playWaterIdle').name('Play Water Idle')
    }

    update() {
        if (this.mixer) {
            if (this.time.delta < 100) this.mixer.update(this.time.delta * 0.001)
        }
    }
}
