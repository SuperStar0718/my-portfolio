import * as THREE from 'three'
import Experience from '../Experience'
import { gsap } from 'gsap'

export default class SceneFog {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.world.scene
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        this.setFog()
        this.hide()
    }

    setFog() {
        this.fog = new THREE.Fog('#042C61', 15, 20)

        this.scene.fog = this.fog

        // Debug Fog
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Fog').close()

            this.debugFolder.add(this.fog, 'near').min(-3).max(30).step(0.1)
            this.debugFolder.add(this.fog, 'far').min(-3).max(30).step(0.1)
            this.debugFolder.addColor(this.fog, 'color')
        }
    }
    
    hide(duration = .3) {
        gsap.to(this.fog, {near: 30, far: 30, duration: duration})
    }
}