import * as THREE from 'three'
import Experience from '../../Experience.js'
import shadowVertex from '../../shaders/shadow/vertex.glsl'
import shadowFragment from '../../shaders/shadow/fragment.glsl'

export default class LabShadow {
    parameters = {
        color: '#002152'
    }

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.lab = this.experience.world.lab.model
        
        this.resource = this.resources.items.labShadowModel

        this.setModel()
        this.setMaterial()
        this.initDebug()
    }

    setModel() {
        this.model = this.resource.scene

        this.lab.model.add(this.model)
    }

    setMaterial() {
        // set texture 
        this.shadowTexture = this.resources.items.bakedShadowLabTexture
        this.shadowTexture.flipY = false

        // material 
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                alphaMask: { value: this.shadowTexture },
                uColor: { value: new THREE.Color(this.parameters.color) },
                uOpacity: { value: 1 }
            },
            vertexShader: shadowVertex,
            fragmentShader: shadowFragment,
        })
        
        this.model.children.find((children) => children.name === 'shadowCatcher').material = this.material
    }

    initDebug() {
        if(this.debug.active) {
            this.lab.debugFolder
            .addColor(this.parameters, 'color')
            .onChange(() => {
                this.material.uniforms.uColor.value = new THREE.Color(this.parameters.color)
            })
            .name('Shadow Color')
        }
    }
}