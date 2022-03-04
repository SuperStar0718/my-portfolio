import Experience from "../../Experience"
import * as THREE from 'three'

export default class LabScreen {

    parameters = {
        speed: 0.0005
    }

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.lab = this.experience.world.lab.model

        this.setModel()
        this.setMaterial()
        this.initDebug()
    }

    setModel() {
        this.model = this.lab.model.children.find((child) => child.name === 'desktop')
    }

    setMaterial() {
        this.texture = this.resources.items.labScreenGraph
        this.texture.flipY = true
        this.texture.wrapS = THREE.RepeatWrapping

        this.material = new THREE.MeshBasicMaterial({ map: this.texture })

        this.model.material = this.material
    }

    initDebug() {
        if(this.debug.active) {
            this.debugFolder = this.lab.debugFolder.addFolder('Screen').close()

            this.debugFolder.add(this.parameters, 'speed').min(0).max(0.01).step(0.0001).name('Movement Speed')
        }
    }

    update() {
        this.texture.offset.x -= this.parameters.speed
    }
}