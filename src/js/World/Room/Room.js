import * as THREE from 'three'
import Experience from '../../Experience.js'
import { gsap, Power2, Power4, Back } from 'gsap'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.shadow = this.experience.world.landingPage.roomShadow

        this.desktopLayers = {}

        // Debug 
        if (this.debug.active) {
            this.initDebug()
        }

        this.setModel()
        this.setMaterial()
        this.addShadow()
    }

    // Set room model 
    setModel() {
        this.model = this.resources.items.roomModel.scene
        this.baseModel = this.model.children.find((child) => child.name === 'room-base')

        //Take desktops plane and move to base model to animate room bounce
        this.deskopPlane0 = this.model.children.find((child) => child.name === 'desktop-plane-0')
        this.deskopPlane1 = this.model.children.find((child) => child.name === 'desktop-plane-1')

        this.deskopPlane0.position.z += 2.229
        this.deskopPlane1.position.z += 2.229

        this.baseModel.add(this.deskopPlane0)
        this.baseModel.add(this.deskopPlane1)

        this.model.rotation.y = -Math.PI / 2
        this.model.position.y -= 5.7

        this.scene.add(this.model)
    }

    setMaterial() {
        // texture 
        this.texture = this.resources.items.bakedRoomTexture
        this.texture.flipY = false

        // material 
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true })

        this.model.traverse((child) => {
            child.material = this.material
        })
    }

    addShadow() {
        this.model.add(this.shadow.model)
    }

    bounceIn(delay = 0) {
        //Base Model bounce
        gsap.fromTo(this.baseModel.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: .5, ease: Back.easeOut.config(1.5), delay: delay })

        gsap.fromTo(this.shadow.material.uniforms.uOpacity, { value: 0 }, { value: 1, duration: .15, delay: delay + .16 })
    }

    bounceOut(delay = 0) {
        //base model bounce
        gsap.fromTo(this.baseModel.scale, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0, duration: .5, ease: Back.easeIn.config(1.5), delay: delay })

        //shadow fade out
        gsap.fromTo(this.shadow.material.uniforms.uOpacity, { value: 1 }, { value: 0, duration: .15, delay: delay + .25 })
    }

    initDebug() {
        this.debugFolder = this.debug.ui.addFolder('Room').close()

        this.debugFolder
            .addColor(this.shadow.parameters, 'color')
            .onChange(() => {
                this.shadow.material.uniforms.uColor.value = new THREE.Color(this.shadow.parameters.color)
            })
            .name('Shadow Color')
    }
}