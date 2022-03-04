import Experience from "../../Experience"
import * as THREE from 'three'
import tubeFragmentShader from '../../shaders/tube/fragment.glsl'
import tubeVertexShader from '../../shaders/tube/vertex.glsl'

export default class Tube {

    parameters = {
        uColorTop: '#0084ff',
        uColorBottom: '#00ffff',
        uOpacity: 0.25,
    }

    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.lab = this.experience.world.lab.model

        this.setMaterial()
        this.setModel()
        this.initDebug()
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uColorTop: { value: new THREE.Color(this.parameters.uColorTop) },
                uColorBottom: { value: new THREE.Color(this.parameters.uColorBottom) },
                uOpacity: { value: this.parameters.uOpacity },
            },
            vertexShader: tubeVertexShader,
            fragmentShader: tubeFragmentShader,
            transparent: true
        })
    }

    setModel() {
        //Geometry
        this.geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32, 1, true)

        //Model
        this.model = new THREE.Mesh(this.geometry, this.material)

        //Positon and scale to fit into scene
        this.model.position.set(-0.08, 2.9, -0.12)
        this.model.scale.set(0.92, 1.52, 0.92)

        this.lab.model.add(this.model)
    }

    initDebug() {
        if (this.debug.active) {
            this.debugFolder = this.lab.debugFolder.addFolder('Tube').close()

            //Opacity
            this.debugFolder.add(this.material.uniforms.uOpacity, 'value').min(0).max(1).step(0.01).name('Opacity')

            // Scale
            this.debugFolder.add(this.model.scale, 'x').min(0).max(4).step(0.01).name('Scale X')
            this.debugFolder.add(this.model.scale, 'y').min(0).max(4).step(0.01).name('Scale Y')
            this.debugFolder.add(this.model.scale, 'z').min(0).max(4).step(0.01).name('Scale Z')

            //Position
            this.debugFolder.add(this.model.position, 'x').min(-5).max(5).step(0.01).name('Position X')
            this.debugFolder.add(this.model.position, 'y').min(-5).max(5).step(0.01).name('Position Y')
            this.debugFolder.add(this.model.position, 'z').min(-5).max(5).step(0.01).name('Position Z')

            //Colors
            this.debugFolder
                .addColor(this.parameters, 'uColorTop')
                .onChange(() => { this.material.uniforms.uColorTop.value = new THREE.Color(this.parameters.uColorTop) })
                .name('Top Color')

            this.debugFolder
                .addColor(this.parameters, 'uColorBottom')
                .onChange(() => { this.material.uniforms.uColorBottom.value = new THREE.Color(this.parameters.uColorBottom) })
                .name('Bottom Color')
        }
    }
}