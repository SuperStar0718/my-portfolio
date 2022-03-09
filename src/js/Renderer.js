import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer, EffectPass, RenderPass, DepthOfFieldEffect, SMAAEffect, SMAAImageLoader, BrightnessContrastEffect } from "postprocessing"

export default class Renderer {

    parameters = {
        usePostprocess: false
    }

    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        this.setInstance()
        if (this.parameters.usePostprocess) this.setPostProcess()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance',

            // antialias: false,
            // stencil: false,
            // alpha: false,
            // depth: false
        })

        this.instance.outputEncoding = THREE.sRGBEncoding

        this.instance.setClearColor('#F5EFE6')

        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    setPostProcess() {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        this.postProcess.composer = new EffectComposer(this.instance, {
            frameBufferType: THREE.HalfFloatType,

        })
        this.postProcess.depthOfField = new DepthOfFieldEffect()
        this.postProcess.contrast = new BrightnessContrastEffect()

        new SMAAImageLoader().load(([search, area]) => {
            this.postProcess.smaaEffect = new SMAAEffect(search, area)
            this.postProcess.composer.addPass(new EffectPass(this.camera.instance, this.postProcess.depthOfField, this.postProcess.smaaEffect))
        })

        this.postProcess.composer.addPass(this.postProcess.renderPass)
        this.postProcess.composer.addPass(new EffectPass(this.camera, this.postProcess.contrast))



        this.postProcess.composer.setSize(this.sizes.width, this.sizes.height)

        // Debug
        if (this.debug.active) {
            this.debugFolders = {
                main: this.debug.ui.addFolder('Renderer').close()
            }

            //Post Processing
            this.debugFolders.main.add(this.parameters, 'usePostprocess')

            // Tone Mapping
            this.debugFolders.toneMapping = this.debugFolders.main.addFolder('Tone Mapping')
            this.debugFolders.toneMapping.add(this.instance, 'toneMapping')
            this.debugFolders.toneMapping.add(this.instance, 'toneMappingExposure').min(0).max(2).name('Exposure')

            //Depth Of Field
            this.debugFolders.depthOfField = this.debugFolders.main.addFolder('Depth Of Field')

            this.debugFolders.depthOfField.add(this.postProcess.depthOfField, 'bokehScale').min(0).max(5)
            this.debugFolders.depthOfField.add(this.postProcess.depthOfField.circleOfConfusionMaterial.uniforms.focusDistance, 'value').min(0).max(5).step(0.001).name('Focus')
            this.debugFolders.depthOfField.add(this.postProcess.depthOfField.circleOfConfusionMaterial.uniforms.focalLength, 'value').min(0).max(1).step(0.001).name('Focal Length')
            this.debugFolders.depthOfField.add(this.postProcess.depthOfField.blendMode.opacity, 'value').min(0).max(1).step(0.001).name('Vignette Opacity')

            //Brightness
            this.brightnessParameters = {
                brightness: 0,
                contrast: 0,
            }

            this.debugFolders.brightness = this.debugFolders.main.addFolder('Brightness Contrast')

            this.debugFolders.brightness.add(this.brightnessParameters, 'brightness').min(-1).max(1).step(0.01).onChange(() => this.postProcess.contrast.uniforms.get('brightness').value = this.brightnessParameters.brightness)
            this.debugFolders.brightness.add(this.brightnessParameters, 'contrast').min(-1).max(1).step(0.01).onChange(() => this.postProcess.contrast.uniforms.get('contrast').value = this.brightnessParameters.contrast)
        }

    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        //Post Process
        //this.postProcess.composer.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        if (this.parameters.usePostprocess) {
            this.postProcess.composer.render()
        }
        else {
            this.instance.render(this.scene, this.camera.instance)
        }
    }
}