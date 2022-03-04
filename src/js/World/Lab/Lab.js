import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Lab {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.desktopLayers = {}

        // Debug 
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Lab').close()
        }

        this.setModel()
        this.setPosition()
        this.setMaterial()
        this.setBottomMaterial()
    }

    setModel() {
        this.model = this.resources.items.labModel.scene

        this.model.rotation.y = -Math.PI / 2

        this.scene.add(this.model)
    }

    setPosition() {
        this.model.position.y -= 15.9
        this.model.scale.set(0.95, 0.95, 0.95)
    }

    // Set room baked material 
    setMaterial() {
        this.texture = this.resources.items.bakedLabTexture
        this.texture.flipY = false

        this.material = new THREE.MeshBasicMaterial({ map: this.texture })

        this.model.traverse((child) => {
            child.material = this.material
        })
    }

    setBottomMaterial() {
        this.bottomMaterial = new THREE.MeshBasicMaterial({color: 'gray'})

        this.bottom = this.model.children.find((child) => child.name === 'bottom')

        this.bottom.position.y -= 0.005
        
        this.bottom.material = this.bottomMaterial
    }
}