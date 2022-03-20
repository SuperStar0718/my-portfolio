import backgroundVertex from '../shaders/background/vertex.glsl'
import backgroundFragment from '../shaders/background/fragment.glsl'
import Experience from '../Experience'
import * as THREE from 'three'

export default class Background {

    height = 3.5

    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.setBackground()
    }

    setBackground() {
        this.colors = {}

        this.colors.topLeft = {}
        this.colors.topLeft.value = '#000b38'
        this.colors.topLeft.instance = new THREE.Color(this.colors.topLeft.value)

        this.colors.topRight = {}
        this.colors.topRight.value = '#032a59'
        this.colors.topRight.instance = new THREE.Color(this.colors.topRight.value)

        this.colors.bottomLeft = {}
        this.colors.bottomLeft.value = '#06346f'
        this.colors.bottomLeft.instance = new THREE.Color(this.colors.bottomLeft.value)

        this.colors.bottomRight = {}
        this.colors.bottomRight.value = '#1280c4'
        this.colors.bottomRight.instance = new THREE.Color(this.colors.bottomRight.value)

        // Geometry
        this.geometry = new THREE.PlaneGeometry(2, this.height, 1, 1)

        // Material
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uOffset: { value: -this.height }
            },
            vertexColors: true,
            depthWrite: false,
            vertexShader: backgroundVertex,
            fragmentShader: backgroundFragment,
            precision: 'lowp',
        })

        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.frustumCulled = false
        this.scene.add(this.mesh)

        // Update colors
        this.updateColors = () => {
            this.colors.topLeft.instance.set(this.colors.topLeft.value)
            this.colors.topRight.instance.set(this.colors.topRight.value)
            this.colors.bottomLeft.instance.set(this.colors.bottomLeft.value)
            this.colors.bottomRight.instance.set(this.colors.bottomRight.value)

            const colors = new Float32Array(4 * 3)

            colors[0] = this.colors.topLeft.instance.r
            colors[1] = this.colors.topLeft.instance.g
            colors[2] = this.colors.topLeft.instance.b

            colors[3] = this.colors.topRight.instance.r
            colors[4] = this.colors.topRight.instance.g
            colors[5] = this.colors.topRight.instance.b

            colors[6] = this.colors.bottomLeft.instance.r
            colors[7] = this.colors.bottomLeft.instance.g
            colors[8] = this.colors.bottomLeft.instance.b

            colors[9] = this.colors.bottomRight.instance.r
            colors[10] = this.colors.bottomRight.instance.g
            colors[11] = this.colors.bottomRight.instance.b

            this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        }
        this.updateColors()

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Lab Background').close()

            this.debugFolder.addColor(this.colors.topLeft, 'value').onChange(() => this.updateColors()).name('Top Left Color')
            this.debugFolder.addColor(this.colors.topRight, 'value').onChange(() => this.updateColors()).name('Top Right Color')
            this.debugFolder.addColor(this.colors.bottomLeft, 'value').onChange(() => this.updateColors()).name('Bottom Left Color')
            this.debugFolder.addColor(this.colors.bottomRight, 'value').onChange(() => this.updateColors()).name('Bottom Rigth Color')
        }
    }
}