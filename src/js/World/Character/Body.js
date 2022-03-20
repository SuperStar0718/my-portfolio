import Experience from "../../Experience"
import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Body {
    constructor(model) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.model = model

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.folders.find((folder) => folder._title === 'Character').addFolder('Wireframe')
        }

        // Setup main 
        this.defineBodyParts()
        this.defineMaterials()
        this.applyMaterials()
        this.deactiveFrustumCulling()

        // Setup face 
        this.setFace()

        // Wireframe & Visibility triggers
        this.defineWireframe()
        this.defineWireframeAt()
    }

    // ------------------------ MAIN ---------------------------------------------------------------------------------------------- 
    defineBodyParts() {
        // Armature 
        this.armature = this.model.children.find((child) => child.name === 'armature')


        // Define Body 
        this.armLeft = this.armature.children.find((child) => child.name === 'arm-left')
        this.armRight = this.armature.children.find((child) => child.name === 'arm-right')
        this.legRight = this.armature.children.find((child) => child.name === 'leg-right')
        this.legLeft = this.armature.children.find((child) => child.name === 'leg-left')
        this.shoeRight = this.armature.children.find((child) => child.name === 'shoe-right')
        this.shoeLeft = this.armature.children.find((child) => child.name === 'shoe-left')
        this.shoeWhiteRight = this.armature.children.find((child) => child.name === 'shoe-white-right')
        this.shoeWhiteLeft = this.armature.children.find((child) => child.name === 'shoe-white-left')
        this.sockRight = this.armature.children.find((child) => child.name === 'sock-right')
        this.sockLeft = this.armature.children.find((child) => child.name === 'sock-left')
        this.pantsBottomRight = this.armature.children.find((child) => child.name === 'pants-bottom-right')
        this.pantsBottomLeft = this.armature.children.find((child) => child.name === 'pants-bottom-left')
        this.pantsRight = this.armature.children.find((child) => child.name === 'pants-right')
        this.pantsLeft = this.armature.children.find((child) => child.name === 'pants-left')
        this.chest = this.armature.children.find((child) => child.name === 'chest')
        this.shoulderRight = this.armature.children.find((child) => child.name === 'shoulder-right')
        this.shoulderLeft = this.armature.children.find((child) => child.name === 'shoulder-left')
        this.throat = this.armature.children.find((child) => child.name === 'throat')

        // Define head 
        this.chest = this.armature.children.find((child) => child.name === 'chest')
        this.head = this.armature.children.find((child) => child.name === 'head')
    }

    deactiveFrustumCulling() {
        this.armature.children.forEach((child) => {
            if (child.type === 'SkinnedMesh') {
                child.frustumCulled = false
            }
        })
    }

    defineMaterials() {
        this.materials = {}

        // Define Matcap materials 
        this.materials.shirtMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.shirtMatcap, transparent: true, fog: false })
        this.materials.skinMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.skinMatcap, transparent: true, fog: false })
        this.materials.pantsMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.pantsMatcap, transparent: true, fog: false })
        this.materials.whiteMaterial = new THREE.MeshMatcapMaterial({ matcap: this.resources.items.whiteMatcap, transparent: true, fog: false })

        // Define baked materials 
        this.bakedTexture = this.resources.items.bakedCharacterHeadTexture
        this.bakedTexture.flipY = false
        this.materials.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture, fog: false })
    }

    applyMaterials() {
        this.armRight.material = this.materials.skinMaterial
        this.armLeft.material = this.materials.skinMaterial
        this.legRight.material = this.materials.skinMaterial
        this.legLeft.material = this.materials.skinMaterial
        this.shoeRight.material = this.materials.shirtMaterial
        this.shoeLeft.material = this.materials.shirtMaterial
        this.shoeWhiteRight.material = this.materials.whiteMaterial
        this.shoeWhiteLeft.material = this.materials.whiteMaterial
        this.sockRight.material = this.materials.whiteMaterial
        this.sockLeft.material = this.materials.whiteMaterial
        this.pantsBottomRight.material = this.materials.shirtMaterial
        this.pantsBottomLeft.material = this.materials.shirtMaterial
        this.pantsRight.material = this.materials.pantsMaterial
        this.pantsLeft.material = this.materials.pantsMaterial
        this.chest.material = this.materials.shirtMaterial
        this.shoulderRight.material = this.materials.shirtMaterial
        this.shoulderLeft.material = this.materials.shirtMaterial
        this.throat.material = this.materials.skinMaterial
        this.head.material = this.materials.bakedMaterial
    }

    // Set wireframe distances for section 1 wireframe animation 
    defineWireframeAt() {
        this.legRight.wireframeAt = '-9.1'
        this.legLeft.wireframeAt = '-9.1'
        this.shoeRight.wireframeAt = '-9'
        this.shoeLeft.wireframeAt = '-9'
        this.shoeWhiteRight.wireframeAt = '-9'
        this.shoeWhiteLeft.wireframeAt = '-9'
        this.sockRight.wireframeAt = '-9'
        this.sockLeft.wireframeAt = '-9'
        this.pantsBottomRight.wireframeAt = '-9.2'
        this.pantsBottomLeft.wireframeAt = '-9.2'
        this.pantsRight.wireframeAt = '-10'
        this.pantsLeft.wireframeAt = '-10'
        this.chest.wireframeAt = '-11'
        this.shoulderRight.wireframeAt = '-11'
        this.shoulderLeft.wireframeAt = '-11'
        this.throat.wireframeAt = '-11.2'
        this.head.wireframeAt = '-11.5'
        this.face.wireframeAt = '-11.5'
        this.armRight.wireframeAt = '-11.55'
        this.armLeft.wireframeAt = '-11.5'
    }

    // ------------------------ FACE ---------------------------------------------------------------------------------------------- 
    setFace() {
        // Define model 
        this.face = this.armature.children.find((child) => child.name === 'face')

        // Define textures 
        this.faceTextures = {
            default: this.resources.items.characterDefaultFace,
            scared: this.resources.items.characterScaredFace,
            sleepy: this.resources.items.characterSleepyFace,
        }

        // Material 
        this.face.material = new THREE.MeshBasicMaterial({ map: this.faceTextures.default, transparent: true, fog: false })

        this.defineFaceTransitions()
    }

    defineFaceTransitions() {
        this.faceTransitions = {}

        //Smile
        this.faceTransitions.smile = {
            allowedOutsideLanding: false,
            faces: [
                this.resources.items.characterSmile0Face,
                this.resources.items.characterSmile1Face,
                this.resources.items.characterSmile2Face
            ]
        }
        
        //Contact Transition Face
        this.faceTransitions.contact = {
            allowedOutsideLanding: true,
            faces: [
                this.resources.items.characterScaredFace,
                this.resources.items.characterContact1Face,
                this.resources.items.characterContact2Face,
            ]
        }
    }

    updateFace(name) {
        this.landingPage = this.experience.ui.landingPage

        if (name === 'default') {
            //Update count
            this.faceTransitions.count = this.faceTransitions.current.faces.length - 1

            //Interval
            const faceTransitionsTimeout = () => this.faceCall = gsap.delayedCall(.033, () => {
                if (this.landingPage.visible || this.faceTransitions.current.allowedOutsideLanding) {
                    //Update Map
                    this.face.material.map = this.faceTransitions.current.faces[this.faceTransitions.count]
                    //Decrease count until -1 then set to default face
                    this.faceTransitions.count--

                    if (this.faceTransitions.count == -1) {
                        this.face.material.map = this.faceTextures.default
                    } else {
                        faceTransitionsTimeout()
                    }
                }
            })
            faceTransitionsTimeout()

        } else {
            //Define
            this.faceTransitions.current = this.faceTransitions[name]
            this.faceTransitions.count = 0

            //Interval
            const faceTransitionsTimeout = () => this.faceCall = gsap.delayedCall(.033, () => {
                if (this.landingPage.visible || this.faceTransitions.current.allowedOutsideLanding) {
                    //Update map
                    this.face.material.map = this.faceTransitions[name].faces[this.faceTransitions.count]

                    //update count
                    this.faceTransitions.count++
                    if (this.faceTransitions.count != this.faceTransitions[name].faces.length) {
                        faceTransitionsTimeout()
                    }
                }
            })
            faceTransitionsTimeout()
        }
    }

    // ------------------------ Wireframe ---------------------------------------------------------------------------------------------- 
    defineWireframe() {
        this.wireframeParameters = {
            color: '#009dff',
        }

        // Wireframe Material 
        this.materials.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: this.wireframeParameters.color,
            wireframe: true,
            opacity: 0.3,
            blending: 2,
            wireframeLinewidth: 1,
            fog: false,
        })

        this.debugWireframe()
    }

    debugWireframe() {
        if (this.debug.active) {
            this.debugFolder.addColor(this.wireframeParameters, 'color').onChange(() => { this.materials.wireframeMaterial.color = new THREE.Color(this.wireframeParameters.color) })
            this.debugFolder.add(this.materials.wireframeMaterial, 'opacity').min(0).max(1).step(0.01)
            this.debugFolder.add(this.materials.wireframeMaterial, 'wireframeLinewidth').min(0.01).max(5).step(0.1)
            this.debugFolder.add(this.materials.wireframeMaterial, 'blending').min(0).max(5).step(1)
            this.debugFolder.add(this.materials.wireframeMaterial, 'depthTest')
            this.debugFolder.add(this.materials.wireframeMaterial, 'transparent').onChange(() => this.materials.wireframeMaterial.needsUpdate = true)

            this.debugFolder.close()
        }
    }
}