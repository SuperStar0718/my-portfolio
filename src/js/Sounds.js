import { Howl, Howler } from 'howler'
import Experience from './Experience'

import mouseWheel0Sound from '../assets/sounds/mouse-wheel-0.mp3'
import mouseWheel1Sound from '../assets/sounds/mouse-wheel-1.mp3'
import mouseWheel2Sound from '../assets/sounds/mouse-wheel-2.mp3'

export default class Sounds {

    items = [
        {
            name: 'mouseWheel',
            files: [mouseWheel0Sound, mouseWheel1Sound, mouseWheel2Sound]
        }
    ]

    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.setMute()
        this.setMasterVolume()
        this.setupSounds()
        if (this.debug.active) this.initDebug()
    }

    setupSounds() {
        this.items.forEach((item) => {
            item.howls = []
            item.files.forEach((file) => {
                item.howls.push(new Howl({ src: file }))
            })
        })
    }

    play(name) {
        const item = this.items.find((item) => item.name === name)

        //Play random
        item.howls[Math.floor(Math.random() * item.howls.length)].play()
    }

    mute(boolean) {
        Howler.mute(boolean)
    }

    setMute() {
        // Tab focus / blur
        document.addEventListener('visibilitychange', () => {
            Howler.mute(document.hidden)
        })
    }

    setMasterVolume() {
        // Set up
        this.masterVolume = 0.5
        Howler.volume(this.masterVolume)

        window.requestAnimationFrame(() => {
            Howler.volume(this.masterVolume)
        })
    }

    initDebug() {
        this.debugFolder = this.debug.ui.addFolder('Sound')

        this.debugFolder.add(this, 'masterVolume').step(0.001).min(0).max(1).onChange(() => { Howler.volume(this.masterVolume) })
    }
}