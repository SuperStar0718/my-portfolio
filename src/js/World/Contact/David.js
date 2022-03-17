import * as THREE from 'three'
import Experience from '../../Experience'

export default class David {
    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.contactScene = this.experience.world.contact.scene
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        this.setSprite()
        this.initDebug()
        this.onOrientationChange()

        //Orientation Change
        this.sizes.on('portrait', () => this.onOrientationChange())
        this.sizes.on('landscape', () => this.onOrientationChange())
    }

    onOrientationChange() {
        if (this.sizes.portrait) {
            this.sprite.scale.set(3.43, 6.56)
            this.sprite.position.set(-0.35, 3, -0.5)
        } else {
            this.sprite.scale.set(2.64, 5.05)
            this.sprite.position.set(-0.55, 1.9, -0.5)
        }
    }

    setSprite() {
        this.texture = this.resources.items.davidImage

        this.material = new THREE.SpriteMaterial({ map: this.texture, depthTest: false, fog: false, opacity: 0 })

        this.sprite = new THREE.Sprite(this.material)

        this.contactScene.model.add(this.sprite)
    }

    initDebug() {
        if (this.debug.active) {
            this.debugFolder = this.contactScene.debugFolder.addFolder('Image')

            this.debugFolder.add(this.sprite.scale, 'x').min(1).max(15).step(0.1)
            this.debugFolder.add(this.sprite.scale, 'y').min(1).max(15).step(0.1)
            this.debugFolder.add(this.sprite.position, 'x').min(-2).max(5).step(0.1).name('Position X')
            this.debugFolder.add(this.sprite.position, 'y').min(-2).max(5).step(0.1).name('Position Y')
            this.debugFolder.add(this.sprite.position, 'z').min(-2).max(5).step(0.1).name('Position Z')
        }
    }
} 