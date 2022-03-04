import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Room {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.desktopLayers = {}

        // Debug 
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Room').close()
        }

        this.setModel()
        this.setMaterial()
    }

    // Set room model 
    setModel() {
        this.model = this.resources.items.roomModel.scene

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
}