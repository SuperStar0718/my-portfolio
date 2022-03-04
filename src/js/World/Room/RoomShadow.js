import * as THREE from 'three'
import Experience from '../../Experience.js'
import roomShadowVertex from '../../shaders/shadow/vertex.glsl'
import roomShadowFragment from '../../shaders/shadow/fragment.glsl'

export default class RoomShadow {
    parameters = {
        color: '#936733'
    }

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.room = this.experience.world.landingPage.room

        // Resource
        this.resource = this.resources.items.roomShadowModel

        this.setModel()
        this.setMaterial()
        this.initDebug()
    }

    setModel() {
        this.model = this.resource.scene

        this.room.model.add(this.model)
    }

    setMaterial() {
        // texture 
        this.shadowTexture = this.resources.items.bakedShadowRoomTexture
        this.shadowTexture.flipY = false

        // material 
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                alphaMask: { value: this.shadowTexture },
                uColor: { value: new THREE.Color(this.parameters.color) }
            },
            vertexShader: roomShadowVertex,
            fragmentShader: roomShadowFragment
        })

        this.model.children.find((children) => children.name === 'shadowCatcher').material = this.material
    }

    initDebug() {
        if (this.debug.active) {
            this.room.debugFolder
                .addColor(this.parameters, 'color')
                .onChange(() => {
                    this.material.uniforms.uColor.value = new THREE.Color(this.parameters.color)
                })
                .name('Shadow Color')
        }
    }
}