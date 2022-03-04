import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Vector3 } from 'three'

export default class Camera {

    parallax = {
        intensity: 0.35,
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
        this.cursor.x = 0
        this.cursor.y = 0

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
        if (this.controls) {
            this.controls.update()
        }

        this.updateParallax()
    }

    // update parallax animation using cursor movement 
    updateParallax() {
        if (this.parallax.enabled && !this.sizes.mobile) {
            const parallaxX = this.cursor.x * this.parallax.intensity
            const parallaxY = -this.cursor.y * this.parallax.intensity
            const deltaTime = this.time.delta / 1000

            const byX = (parallaxX - this.cameraParallaxGroup.position.x) * 5 * deltaTime
            const byY = (parallaxY - this.cameraParallaxGroup.position.y) * 5 * deltaTime

            if (byX < 0.05 && byX > -0.05) this.cameraParallaxGroup.position.x += byX
            if (byY < 0.05 && byY > -0.05) this.cameraParallaxGroup.position.y += byY
        }
    }

    // Debug 
    initDebug() {
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Camera').close()

            const debugObject = {
                unlockControls: () => { this.unlockControls() },
            }
            this.debugFolder.add(debugObject, 'unlockControls').name('Unlock Orbit Controls')

            this.debugFolder.add(this.instance.position, 'x').min(-5).max(15).step(0.01)
            this.debugFolder.add(this.instance.position, 'y').min(-5).max(15).step(0.01)
            this.debugFolder.add(this.instance.position, 'z').min(-15).max(25).step(0.01)

            const updateLookAt = () => this.instance.lookAt(this.lookAtStartParameters)

            this.debugFolder.add(this.lookAtStartParameters, 'x').min(-20).max(10).step(0.01).name('Look At X').onChange(() => updateLookAt())
            this.debugFolder.add(this.lookAtStartParameters, 'y').min(-20).max(10).step(0.01).name('Look At Y').onChange(() => updateLookAt())
            this.debugFolder.add(this.lookAtStartParameters, 'z').min(-20).max(10).step(0.01).name('Look At Z').onChange(() => updateLookAt())
        }
    }

    unlockControls() {
        if (!this.controls) {
            this.controls = new OrbitControls(this.instance, this.canvas)
            this.controls.enableDamping = true
        }
    }
}