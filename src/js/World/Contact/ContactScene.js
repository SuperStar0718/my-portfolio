import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class ContactScene {

    parameters = {
        portraitY: -53.5,
        landscapeY: -28
    }

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        // Debug 
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Contact Scene').close()
        }

        this.setModel()
        this.setMaterial()

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    onOrientationChange() {
        this.model.position.y = this.sizes.portrait ? this.parameters.portraitY : this.parameters.landscapeY
    }

    // Set room model 
    setModel() {
        this.model = this.resources.items.contactSceneModel.scene

        this.model.position.y = this.sizes.portrait ? this.parameters.portraitY : this.parameters.landscapeY

        this.scene.add(this.model)
    }

    setMaterial() {
        // texture 
        this.texture = this.resources.items.bakedContactTexture
        this.texture.flipY = false

        // material 
        this.material = new THREE.MeshBasicMaterial({ map: this.texture })

        this.model.traverse((child) => {
            child.material = this.material
        })
    }
}