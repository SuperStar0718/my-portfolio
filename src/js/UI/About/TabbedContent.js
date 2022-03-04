import Experience from '../../Experience.js'
import { gsap, Power2 } from 'gsap'

export default class AboutTabbedContent {

    domElements = {
        leftLine: document.getElementById('about-info-left-line'),
        rightLine: document.getElementById('about-info-right-line'),
        infoBackground: document.getElementById('about-info-background'),
        profilePictureMaskRect: document.getElementById('about-profile-picture-mask-rect'),
        profilePictureGradient: document.getElementById('about-profile-picture-gradient'),
        headerSvg: document.getElementById('about-header-svg'),
        infoSvg: document.getElementById('about-info-svg'),
    }

    animatedSpans = {
        infoGermany: {
            domElement: document.getElementById('about-header-germany'),
            text: 'Germany'
        },
        infoDavid: {
            domElement: document.getElementById('about-header-david'),
            text: 'David'
        },
        info23: {
            domElement: document.getElementById('about-header-23'),
            text: '23'
        },
    }

    constructor() {
        this.experience = new Experience()
        this.skills = this.experience.ui.about.render.skills
        this.scroll = this.experience.ui.scroll
        this.icons = this.experience.ui.about.icons

        //this.addScrollEvents()
        //this.addTabEventListeners()
    }

    // ------------------------ Tabbed Content ---------------------------------------------------------------------------------------------- 
    tabs = [
        {
            name: 'skills',
            opener: document.getElementById('about-skills-tab'),
            content: document.getElementById('about-skills-container'),
            leftPath: '253,40 240,40 230,5 30,5 20,40 0,40 0,330 253,330',
            rightPath: '253,40 500,40 500,315 340,315 325,330 253,330',
            backgroundPath: '325,330 340,315 500,315 500,40 253,40 240,40 230,5 30,5 20,40 0,40 0,330 253,330',
            open: () => {
                for (let i = 0; i < this.skills.length; i++) {
                    //Fade in rows from top to bottom
                    gsap.fromTo(document.getElementById('about-skill-container-' + i), { opacity: 0 }, { opacity: 1, duration: .3, delay: i / 10 })
                    //fill bars
                    gsap.fromTo(document.getElementById('about-skill-bar-' + i).style, { width: '0%' }, { width: this.skills[i].width, duration: .3, delay: i / 10 })
                }
            }
        },
        {
            name: 'about',
            opener: document.getElementById('about-about-tab'),
            content: document.getElementById('about-about-container'),
            leftPath: '253,40 0,40 0,330 253,330',
            rightPath: '253,40 263,40 273,5 475,5 483,40 500,40 500,315 340,315 325,330 253,330',
            backgroundPath: '0,330 0,40 253,40 263,40 273,5 475,5 483,40 500,40 500,315 340,315 325,330 253,330',
            open: () => {
                //Fade in icons
                const allIcons = document.querySelectorAll('.about-icon')
                for (let i = 0; i < allIcons.length; i++) {
                    //fade in from top to bottom
                    gsap.fromTo(allIcons[i], { opacity: 0 }, { opacity: 1, duration: .5, delay: i / 5 })
                }

                //Fade in text
                const allText = document.querySelectorAll('.about-text')
                for (let i = 0; i < allText.length; i++) {
                    //fade in from top to bottom
                    gsap.fromTo(allText[i], { opacity: 0 }, { opacity: 1, duration: .5, delay: i / 10 })
                }

                //Pixels
                this.icons.playPixelAnimation(0, 0)
                this.icons.playPixelAnimation(1, .25)
                this.icons.playPixelAnimation(2, .5)
            }
        }
    ]

    addTabEventListeners() {
        this.currentTab = this.tabs[0]

        //skills opener event listener
        this.tabs[0].opener.addEventListener('click', () => {
            if (!this.tabs[0].opener.classList.contains('about-active-tab')) {
                this.openTab(this.tabs[0])
                this.experience.ui.hoverIcon.hideIcon()
            }
        })

        //about opener event listener
        this.tabs[1].opener.addEventListener('click', () => {
            if (!this.tabs[1].opener.classList.contains('about-active-tab')) {
                this.openTab(this.tabs[1])
                this.experience.ui.hoverIcon.hideIcon()
            }
        })
    }

    animateSkills(tab) {
        this.currentTab = tab

        this.hideAllTabs()

        // hide hover icon
        //this.experience.ui.hoverIcon.hideIcon()

        // Classes 
        this.currentTab.opener.classList.add('about-active-tab')
        this.currentTab.content.classList.remove('hide')

        // Update Line paths
        this.domElements.leftLine.setAttribute('points', this.currentTab.leftPath)
        this.domElements.rightLine.setAttribute('points', this.currentTab.rightPath)

        //fill lines
        this.fillLine(this.domElements.leftLine)
        this.fillLine(this.domElements.rightLine)

        // Background 
        this.domElements.infoBackground.setAttribute('points', this.currentTab.backgroundPath)
        gsap.fromTo(this.domElements.infoBackground, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })

        this.currentTab.open()
    }

    hideAllTabs() {
        this.tabs.forEach((tab) => {
            tab.content.classList.add('hide')
            tab.opener.classList.remove('about-active-tab')
        })
    }

    // ------------------------ Animations ---------------------------------------------------------------------------------------------- 
    animateSpan(span, delay, speed = 50) {
        let currentString = ''
        span.domElement.innerHTML = ''

        setTimeout(() => {
            const newCharacterInterval = setInterval(() => {
                // add new letter to current string
                currentString += span.text.charAt(currentString.length)

                //update inner html to current string
                span.domElement.innerHTML = currentString

                // clear interval 
                if (currentString.length == span.text.length) clearInterval(newCharacterInterval)
            }, speed)
        }, delay * 1000)
    }

    animateInfoBox() {
        document.getElementById('about-header-svg').classList.remove('hide')

        // Lines
        this.fillLine(document.querySelectorAll('.about-box-line')[0], .25)
        this.fillLine(document.querySelectorAll('.about-box-line')[1], .25)
        this.fillLine(document.querySelectorAll('.about-box-line')[2])
        this.fillLine(document.querySelectorAll('.about-box-line')[3])

        // Spans
        this.animateSpan(this.animatedSpans.infoDavid, .1)
        this.animateSpan(this.animatedSpans.info23, .2)
        this.animateSpan(this.animatedSpans.infoGermany, .3)

        // Backgrounds
        gsap.fromTo(document.getElementById('about-header-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })
        gsap.fromTo(document.getElementById('about-profile-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })

        // Profile Picture
        this.domElements.profilePictureMaskRect.classList.remove('no-transition')
        this.domElements.profilePictureMaskRect.style.transform = 'translateY(-203px)'

        //Move gradient with Profile picture
        this.domElements.profilePictureGradient.classList.remove('no-transition')
        this.domElements.profilePictureGradient.style.transform = 'translateY(-203px)'
    }

    fadeInHologramUI(delay) {
        gsap.fromTo(this.domElements.headerSvg, { opacity: 0 }, { opacity: 1, delay: delay, duration: .15 })
        gsap.fromTo(this.domElements.infoSvg, { opacity: 0 }, { opacity: 1, delay: delay, duration: .15 })
    }

    playHologramAnimation(delay = 0) {
        //Hide Hologram Animation
        this.fadeInHologramUI(delay)

        //Reset Profile Picture Mask
        this.domElements.profilePictureMaskRect.classList.add('no-transition')
        this.domElements.profilePictureMaskRect.style.transform = 'translateY(0)'

        //Reset Profile Picture Gradient
        this.domElements.profilePictureGradient.classList.add('no-transition')
        this.domElements.profilePictureGradient.style.transform = 'translateY(0)'

        //Start after delay
        gsap.delayedCall(delay, () => {
            this.animateInfoBox()
            //this.openTab(this.currentTab)
        })
    }

    scrollEventsPlayable = false

    addScrollEvents() {
        // Hide SVGs
        this.scroll.addEvent(window.innerHeight, 'down', () => {
            this.scrollEventsPlayable = true
            gsap.to(this.domElements.headerSvg, { opacity: 0, duration: .1 })
            gsap.to(this.domElements.infoSvg, { opacity: 0, duration: .1 })
        })

        //Play Hologram
        this.scroll.addEvent(window.innerHeight * 0.6, 'up', () => setTimeout(() => {
            if (this.scrollEventsPlayable) {
                this.scrollEventsPlayable = false
                this.playHologramAnimation()
            }
        }, 150))
    }

    // ------------------------ SVG ---------------------------------------------------------------------------------------------- 
    fillLine(line, delay = .1) {
        //check if line is rendered
        if (line.getClientRects().length != 0) {
            const lineLength = line.getTotalLength()

            //adapt strok dasharray
            line.style.strokeDasharray = lineLength

            //fill animation
            gsap.fromTo(line.style, { strokeDashoffset: lineLength }, { strokeDashoffset: 0, duration: .6, delay: delay })
        }
    }

    resize() {
        //this.addScrollEvents()
    }
}