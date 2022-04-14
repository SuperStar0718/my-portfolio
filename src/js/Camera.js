import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Vector3 } from 'three'

export default class Camera {

    parallax = {
        intensity: 0.4,
        speed: 5,
        enabled: true
    }

    lookAtStartParameters = new Vector3()

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug
        this.time = this.experience.time

        this.setInstance()
        this.setCursor()
        this.initDebug()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(38, this.sizes.width / this.sizes.height, 0.1, 100)

        //Parallax Group
        this.cameraParallaxGroup = new THREE.Group()
        this.cameraParallaxGroup.add(this.instance)
        this.scene.add(this.cameraParallaxGroup)
    }

    // set cursor for parallax effect 
    setCursor() {
        this.cursor = {}

        window.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5
            this.cursor.y = event.clientY / this.sizes.height - 0.5
        })
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        if (this.controls)
            this.controls.update()

        if (!this.sizes.touch && this.parallax.enabled)
            this.updateParallax()
    }

    // update parallax animation using cursor movement 
    updateParallax() {
        const parallaxX = this.cursor.x * this.parallax.intensity
        const parallaxY = -this.cursor.y * this.parallax.intensity
        const deltaTime = this.time.delta / 1000

        const byX = (parallaxX - this.cameraParallaxGroup.position.x) * this.parallax.speed * deltaTime
        const byY = (parallaxY - this.cameraParallaxGroup.position.y) * this.parallax.speed * deltaTime

        //Update camera position
        if (byX < 0.05 && byX > -0.05) this.cameraParallaxGroup.position.x += byX
        if (byY < 0.05 && byY > -0.05) this.cameraParallaxGroup.position.y += byY
    }

    // Debug 
    initDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Camera').close()

            const debugObject = {
                unlockControls: () => { this.unlockControls() },
            }
            this.debugFolder.add(debugObject, 'unlockControls').name('Unlock Orbit Controls')

            const logPosition = () => console.log('Position updated:', this.instance.position.x, this.instance.position.y, this.instance.position.z)

            this.debugFolder.add(this.instance.position, 'x').min(-5).max(15).step(0.01).onChange(() => logPosition())
            this.debugFolder.add(this.instance.position, 'y').min(-5).max(15).step(0.01).onChange(() => logPosition())


            this.debugFolder.add(this.instance, 'near').min(0.01).max(20).step(0.1).onChange(() => this.instance.updateProjectionMatrix())
            this.debugFolder.add(this.instance, 'far').min(0.01).max(2000).step(1).onChange(() => this.instance.updateProjectionMatrix())

            const updateLookAt = () => {
                this.instance.lookAt(this.lookAtStartParameters)
                console.log('Looking at: ', this.lookAtStartParameters.x, this.lookAtStartParameters.y, this.lookAtStartParameters.z)
            }

            this.debugFolder.add(this.lookAtStartParameters, 'x').min(-20).max(10).step(0.01).name('Look At X').onChange(() => updateLookAt())
            this.debugFolder.add(this.lookAtStartParameters, 'y').min(-20).max(10).step(0.01).name('Look At Y').onChange(() => updateLookAt())
            this.debugFolder.add(this.lookAtStartParameters, 'z').min(-20).max(10).step(0.01).name('Look At Z').onChange(() => updateLookAt())
        }
    }

    unlockControls() {
        if (!this.controls) {
            this.controls = new OrbitControls(this.instance, this.canvas)
            this.controls.enableDamping = true
            this.experience.canvas.style.zIndex = 1000
            this.controls.target.y = this.instance.position.y - 3
        }
    }
}