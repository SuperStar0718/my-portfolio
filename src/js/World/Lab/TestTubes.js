import Experience from "../../Experience";
import * as THREE from 'three'

export default class TestTubes {

    parameters = {
        color: '#004961',
        opacity: 0.05,
    }

    constructor() {
        this.experience = new Experience()
        this.lab = this.experience.world.lab.model
        this.debug = this.experience.debug

        this.setTubes()
        this.initDebug()
    }

    setTubes() {
        //Model
        this.tubes = this.lab.model.children.find((child) => child.name === 'test-tubes')

        //Material
        this.material = new THREE.MeshBasicMaterial({ color: this.parameters.color, transparent: true, opacity: this.parameters.opacity, blending: 5 })

        this.tubes.material = this.material
    }

    initDebug() {
        if(this.debug.active) {
            this.debugFolder = this.lab.debugFolder.addFolder('Test Tubes').close()
            this.debugFolder.addColor(this.parameters, 'color').onChange(() => { this.material.color = new THREE.Color(this.parameters.color) }).name('Test Tube Color')
            this.debugFolder.add(this.material, 'opacity').min(0).max(1).step(0.01).name('Test Tube Opacity')
        }
    }
}
