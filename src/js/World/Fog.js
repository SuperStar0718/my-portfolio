import * as THREE from 'three'
import Experience from '../Experience'

export default class SceneFog {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        this.setFog()
        this.onOrientationChange()

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    onOrientationChange() {
        this.fog.near = this.sizes.portrait ? 18 : 10
        this.fog.far = this.sizes.portrait ? 23 : 17
    }

    setFog() {
        this.fog = new THREE.Fog('#002C6A', 10, 17)

        this.scene.fog = this.fog

        // Debug Fog
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Fog').close()

            this.debugFolder.add(this.fog, 'near').min(-3).max(30).step(0.1)
            this.debugFolder.add(this.fog, 'far').min(-3).max(30).step(0.1)
            this.debugFolder.addColor(this.fog, 'color')
        }
    }
}