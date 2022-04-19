import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class ContactScene {

    parameters = {
        portraitY: -58.3,
        landscapeY: -31.5,
        portraitScale: 1.7,
    }

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        // Debug 
        if (this.debug.active)
            this.debugFolder = this.debug.ui.addFolder('Contact Scene').close()

        this.setModel()
        this.setMaterial()
        this.onOrientationChange()

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    onOrientationChange() {
        //Position and scale depening on orientation
        if (this.sizes.portrait) {
            this.model.position.y = this.parameters.portraitY
            this.model.scale.set(this.parameters.portraitScale, this.parameters.portraitScale, this.parameters.portraitScale)
        } else {
            this.model.position.y = this.parameters.landscapeY
            this.model.scale.set(1, 1, 1)
        }
    }

    // Set room model 
    setModel() {
        this.model = this.resources.items.contactSceneModel.scene

        this.scene.add(this.model)
    }

    setMaterial() {
        // texture 
        this.texture = this.resources.items.bakedContactTexture
        this.texture.flipY = false

        // material 
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, fog: false })

        this.model.children[0].material = this.material
    }
}