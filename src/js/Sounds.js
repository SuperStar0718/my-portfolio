import { Howl, Howler } from 'howler'
import Experience from './Experience'
import { gsap } from 'gsap'

import mouseWheel0Sound from '../assets/sounds/mouse-wheel-0.mp3'
import mouseWheel1Sound from '../assets/sounds/mouse-wheel-1.mp3'
import mouseWheel2Sound from '../assets/sounds/mouse-wheel-2.mp3'

import notificationSound from '../assets/sounds/notification.mp3'

import longKeyboardSound from '../assets/sounds/long-keyboard.mp3'

import labAmbienceSound from '../assets/sounds/lab-ambience.mp3'

import waterSplashSound from '../assets/sounds/water-splash.mp3'

import hologramSound from '../assets/sounds/hologram.mp3'

export default class Sounds {

    active = true

    items = [
        {
            name: 'mouseWheel',
            files: [mouseWheel0Sound, mouseWheel1Sound, mouseWheel2Sound],
            group: 'landing',
            volume: 1,
        },
        {
            name: 'notification',
            files: [notificationSound],
            group: 'landing',
            volume: 1,
        },
        {
            name: 'longKeyboard',
            files: [longKeyboardSound],
            group: 'landing',
            volume: 1,
        },
        {
            name: 'labAmbience',
            files: [labAmbienceSound],
            group: 'lab',
            volume: 0.15,
        },
        {
            name: 'waterSplash',
            files: [waterSplashSound],
            group: 'lab',
            volume: 1,
        },
        {
            name: 'hologram',
            files: [hologramSound],
            group: 'lab',
            volume: 0.6,
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.setMute()
        this.setMasterVolume()
        this.setupSounds()
        this.setLabAmbience()
        if (this.debug.active) this.initDebug()
    }

    setLabAmbience() {
        this.labAmbience = this.items.find((item) => item.name === 'labAmbience').howls[0]

        this.labAmbience._loop = true
        this.labAmbience._volume = 0
        this.labAmbience.name = 'labAmbience'

        this.labAmbience.play()
    }

    labAmbienceScroll(percentage) {
        let vPercentage = percentage === 'recent' ? (this.labAmbience.recentVolumePercentage) : (1 - percentage)

        if (vPercentage < 0) vPercentage = 0

        this.labAmbience.recentVolumePercentage = vPercentage

        this.items.forEach((item) => {
            if (item.group === 'lab') {
                item.howls.forEach((howl) => {
                    gsap.to(howl, { volume: item.volume * vPercentage })
                })
            }
        })
    }

    setupSounds() {
        this.items.forEach((item) => {
            item.howls = []

            item.files.forEach((file) => {
                const howl = new Howl({
                    src: file,
                    volume: item.volume,
                    onplayerror: () => {
                        if (this.debug.active) {
                            console.log('Couldnt play Howl: ' + item.name)
                        }
                    },
                    onloaderror: () => {
                        if (this.debug.active) {
                            console.log('Couldnt load Howl: ' + item.name)
                        }
                    },
                })
                item.howls.push(howl)
            })
        })
    }

    muteGroup(name, mute, duration = .3) {
        this.items.forEach((item) => {
            if (item.group === name) {
                item.howls.forEach((howl) => {
                    //Fade Out
                    gsap.to(howl, { volume: mute ? 0 : item.volume, duration: duration })

                    //Stop
                    if (mute) {
                        setTimeout(() => {
                            if (howl.name !== 'labAmbience')
                                howl.stop()
                        }, duration * 1000)
                    }
                })
            }
        })
    }

    play(name) {
        const item = this.items.find((item) => item.name === name)

        //Play random
        item.howls[Math.floor(Math.random() * item.howls.length)].play()
    }

    mute(boolean) {
        this.active = !boolean
        Howler.mute(boolean)
    }

    setMute() {
        // Tab focus / blur
        document.addEventListener('visibilitychange', () => {
            if (this.active && document.hidden) {
                Howler.mute(true)
            } else if (this.active && !document.hidden) {
                Howler.mute(false)
            }
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