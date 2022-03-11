import Experience from "../../Experience";
import { gsap } from 'gsap'
import * as THREE from 'three'

export default class Desktops {
    constructor() {
        this.experience = new Experience()
        this.room = this.experience.world.landingPage.room
        this.resources = this.experience.resources
        this.sounds = this.experience.sounds

        this.desktops = []
        this.desktopLayers = {}

        this.setDesktop1()
        this.setDesktop0()
    }

    setDesktop0() {
        this.desktop0 = this.room.baseModel.children.find((children) => children.name === 'desktop-plane-0')

        //Material
        this.desktop0Layer0Material = new THREE.MeshBasicMaterial({ map: this.resources.items.desktop0 })
        this.desktop0.material = this.desktop0Layer0Material

        // overlay gradient layer 
        this.addDesktopLayer(
            'desktop0Overlay',
            2,
            this.desktop0,
            this.desktop1.geometry.attributes.uv,
            this.resources.items.desktopOverlay,
            true
        )
    }

    scrollDesktop0() {
        const scrollDepth = Math.random() * (-0.25 - 0.25) + 0.25

        gsap.to(this.resources.items.desktop0.offset, { y: scrollDepth, duration: 1 })

        this.sounds.play('mouseWheel')
    }

    setDesktop1() {
        this.desktop1 = this.room.baseModel.children.find((children) => children.name === 'desktop-plane-1')

        //Material
        this.desktop1PlaneMaterial = new THREE.MeshBasicMaterial({ map: this.resources.items.desktop1 })
        this.desktop1.material = this.desktop1PlaneMaterial

        // notification layer 
        this.addDesktopLayer(
            'desktop1Notification',
            1,
            this.desktop1,
            this.desktop1.geometry.attributes.uv,
            this.resources.items.desktop1Notification,
            true
        )

        //Hide
        this.desktopLayers.desktop1Notification.material.opacity = 0

        // overlay gradient layer 
        this.addDesktopLayer(
            'desktop1Overlay',
            2,
            this.desktop1,
            this.desktop1.geometry.attributes.uv,
            this.resources.items.desktopOverlay,
            true
        )
    }

    // create new desktop layer by cloneing the original and setting its position in front of original 
    addDesktopLayer(name, zIndex, desktop, uvs, image, transparent) {
        //Clone Mesh
        const desktopMesh = desktop.clone()

        //Apply material
        const desktopMaterial = new THREE.MeshBasicMaterial({ map: image, transparent: transparent })
        desktopMesh.material = desktopMaterial

        //Index
        desktopMesh.position.x += zIndex / 1000

        //UVs
        desktopMesh.geometry.setAttribute('uvs', uvs)

        //Add to scene
        this.room.baseModel.add(desktopMesh)

        this.desktopLayers[name] = desktopMesh
    }
}

