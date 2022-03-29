import Experience from '../../Experience.js'
import * as THREE from 'three'
import { gsap, Power0, Back } from 'gsap'

export default class Bubbles {

    count = 17

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.lab = this.experience.world.lab.model
        this.debug = this.experience.debug
        this.sounds = this.experience.sounds

        this.setSprite()
        this.startInterval()

        //Debug
        if (this.debug.active) {
            this.initDebug()
        }
    }

    setSprite() {
        this.sprites = []
        this.availableSprites = []

        for (let i = 0; i < this.count; i++) {
            //Creat new sprite and push to array + available sprites array
            this.sprites.push(
                new THREE.Sprite(new THREE.SpriteMaterial({
                    map: this.resources.items.bubbleSprite,
                    depthTest: false,
                    opacity: 0,
                }))
            )
            this.availableSprites.push(this.sprites[i])

            //Position randomly
            this.sprites[i].position.x = Math.sin(i) * 1.1 //Max radius
            this.sprites[i].position.z = Math.cos(i) * 1.1 /*Max radius*/ - 0.15 // z-offet

            //add to lab scene
            this.lab.model.add(this.sprites[i])
        }
    }

    getAvailableSprite() {
        //get random bubble from available sprites array
        const bubbleToReturn = this.availableSprites[Math.floor(Math.random() * this.availableSprites.length)]

        //remove bubble from available sprites array
        this.availableSprites.splice(this.availableSprites.indexOf(bubbleToReturn), 1)

        return bubbleToReturn
    }

    spawnBubble(startY = Math.random() * 1.1, ease) {
        if (this.availableSprites.length != 0) {
            //get bubble
            const bubble = this.getAvailableSprite()

            //define ease and speed
            const maxBubbleMoveDuration = ease === 'back' ? 4 : 2
            const easeToUse = ease === 'back' ? Back.easeIn.config(2.5) : Power0.easeNone
            const moveDuration = maxBubbleMoveDuration - (maxBubbleMoveDuration * (startY / 3.9))

            startY += 0.8

            //Animate and make bubble available afterwards
            gsap.fromTo(bubble.position,
                { y: startY },
                {
                    y: 4.7, duration: moveDuration, ease: easeToUse, onComplete: () => {
                        this.availableSprites.push(bubble)
                    }
                })

            // Opening
            bubble.material.opacity = 0.5

            //Opening Bounce In
            const scale = Math.random() * 0.12 + 0.2
            gsap.fromTo(bubble.scale, { x: 0, y: 0, z: 0 }, { x: scale, y: scale, z: scale, duration: .5, ease: Back.easeIn.config(1.5) })

            // Fade Out
            gsap.to(bubble.material, { opacity: 0, duration: .2, delay: moveDuration - .2, ease: easeToUse })
        } else {
            if (this.debug.active) {
                console.log('No available bubbles')
            }
        }
    }

    startInterval() {
        gsap.delayedCall((Math.random() * 0.3) + 0.15, () => {
            this.spawnBubble()

            //repeat
            this.startInterval()
        })
    }

    initDebug() {
        this.debugFolder = this.lab.debugFolder.addFolder('Bubbles').close()

        const debugObject = {
            spawnBubble: () => { this.spawnBubble() },
        }
        this.debugFolder.add(debugObject, 'spawnBubble').name('Spawn Bubble')
    }
}