import { Howl, Howler } from 'howler'
import Experience from './Experience'
import { gsap } from 'gsap'

import mouseWheel0Sound from '../assets/sounds/mouse-wheel-0.mp3'
import mouseWheel1Sound from '../assets/sounds/mouse-wheel-1.mp3'
import mouseWheel2Sound from '../assets/sounds/mouse-wheel-2.mp3'

import notificationSound from '../assets/sounds/notification.mp3'

import longKeyboardSound from '../assets/sounds/long-keyboard.mp3'

import roomAmbienceSound from '../assets/sounds/room-ambience.mp3'

import labAmbienceSound from '../assets/sounds/lab-ambience.mp3'

import waterSplashSound from '../assets/sounds/water-splash.mp3'

import hologramSound from '../assets/sounds/hologram.mp3'

import transition0Sound from '../assets/sounds/transition-0.mp3'
import transition1Sound from '../assets/sounds/transition-1.mp3'

import waterUpSound from '../assets/sounds/water-up.mp3'

import gaspSound from '../assets/sounds/gasp.mp3'

import buttonClickSound from '../assets/sounds/button-click.mp3'

import chairImpactSound from '../assets/sounds/chair-impact.mp3'
import chairDownSound from '../assets/sounds/chair-down.mp3'

import pop0Sound from '../assets/sounds/pop-0.mp3'
import pop1Sound from '../assets/sounds/pop-1.mp3'

export default class Sounds {

    items = [
        {
            name: 'mouseWheel',
            files: [mouseWheel0Sound, mouseWheel1Sound, mouseWheel2Sound],
            group: 'landing',
            volume: .7,
        },
        {
            name: 'roomAmbience',
            files: [roomAmbienceSound],
            group: 'landing',
            volume: .15,
        },
        {
            name: 'notification',
            files: [notificationSound],
            group: 'landing',
            volume: .25,
            rate: 1,
        },
        {
            name: 'longKeyboard',
            files: [longKeyboardSound],
            group: 'landing',
            volume: .7,
        },
        {
            name: 'labAmbience',
            files: [labAmbienceSound],
            group: 'lab',
            volume: .15,
        },
        {
            name: 'waterSplash',
            files: [waterSplashSound],
            group: 'lab',
            volume: .3,
        },
        {
            name: 'hologram',
            files: [hologramSound],
            group: 'lab',
            volume: 0.8,
        },
        {
            name: 'transition0',
            files: [transition0Sound],
            group: 'general',
            volume: .5,
        },
        {
            name: 'transition1',
            files: [transition1Sound],
            group: 'general',
            volume: .5,
        },
        {
            name: 'waterUp',
            files: [waterUpSound],
            group: 'general',
            volume: .5,
        },
        {
            name: 'gasp',
            files: [gaspSound],
            group: 'general',
            volume: .2,
        },
        {
            name: 'buttonClick',
            files: [buttonClickSound],
            group: 'general',
            volume: 1,
        },
        {
            name: 'chairDown',
            files: [chairDownSound],
            group: 'landing',
            volume: .4,
        },
        {
            name: 'chairImpact',
            files: [chairImpactSound],
            group: 'landing',
            volume: .4,
        },
        {
            name: 'pop',
            files: [pop0Sound, pop1Sound],
            group: 'landing',
            volume: .3,
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.active = false

        this.setMute()
        this.setMasterVolume()
        this.setupSounds()

        document.addEventListener('visibilitychange', () => this.pauseAll(document.hidden))

        this.setRoomAmbience()
        this.setLabAmbience()

        if (this.debug.active)
            this.initDebug()
    }

    setRoomAmbience() {
        this.roomAmbience = this.items.find((item) => item.name === 'roomAmbience').howls[0]

        this.roomAmbience._loop = true
        this.roomAmbience.name = 'roomAmbience'
    }

    setLabAmbience() {
        this.labAmbience = this.items.find((item) => item.name === 'labAmbience').howls[0]

        this.labAmbience._loop = true
        this.labAmbience._volume = 0
        this.labAmbience.name = 'labAmbience'

        this.labAmbience.play()
    }

    labAmbienceScroll(percentage) {
        if (this.active) {
            let vPercentage = percentage === 'recent' ? (this.labAmbience.recentVolumePercentage) : (1 - percentage)

            if (vPercentage < 0) vPercentage = 0

            this.labAmbience.recentVolumePercentage = vPercentage

            this.items.forEach((item) => {
                if (item.group === 'lab') {
                    item.howls.forEach((howl) => {
                        gsap.to(howl, { volume: item.volume * vPercentage, duration: .2 })
                    })
                }
            })
        }
    }

    setupSounds() {
        this.items.forEach((item) => {
            item.howls = []

            item.files.forEach((file) => {
                const howl = new Howl({
                    src: file,
                    volume: item.volume,
                    rate: item.rate ? item.rate : 1,
                    onplayerror: () => {
                        if (this.debug.active) {
                            console.log('Couldnt play Howl: ' + item.name)
                        }
                        console.log('Couldnt play Howl: ' + item.name)
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

    pauseAll(paused) {
        this.items.forEach((item) => {
            item.howls.forEach((howl) => {
                if (item.name != 'labAmbience' && item.name != 'roomAmbience') {
                    if (paused) {
                        howl.pause()
                    } else {
                        if ((howl.seek() != 0 && howl.seek() != howl.duration()))
                            howl.play()
                    }
                }
            })
        })
    }

    muteGroup(name, mute) {
        this.items.forEach((item) => {
            if (item.group === name) {
                item.howls.forEach((howl) => {
                    //Fade Out
                    gsap.to(howl, { volume: mute ? 0 : item.volume, duration: 1 })

                    //Stop
                    if (mute) {
                        gsap.delayedCall(1, () => {
                            if (howl.name !== 'labAmbience' && howl.name !== 'roomAmbience') {
                                howl.stop()
                            }
                        })
                    }
                })
            }
        })
    }

    play(name) {
        const item = this.items.find((item) => item.name === name)

        //Play random
        if (this.active)
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
        this.masterVolume = 0.6
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