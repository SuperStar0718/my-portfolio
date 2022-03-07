import { gsap, Power2 } from 'gsap'
import Experience from '../../Experience'


export default class AboutAnimations {

    parameters = {
        skillsAdditionalDelay: .2,
        aboutAdditionalDelay: .45,
    }

    domElements = {
        infoBackground: document.getElementById('about-info-background'),
        profilePictureMaskRect: document.getElementById('about-profile-picture-mask-rect'),
        profilePictureGradient: document.getElementById('about-profile-picture-gradient'),
        skillsSvg: document.getElementById('skills-svg'),
        headerGroup: document.getElementById('about-svg-header'),
        skillsGroup: document.getElementById('about-svg-skills'),
        aboutGroup: document.getElementById('about-svg-about'),
        skillsHeaderRect: document.getElementById('skills-header-rect'),
        aboutHeaderRect: document.getElementById('about-header-rect'),
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
        this.icons = this.experience.ui.about.icons
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

        gsap.delayedCall(delay, () => {
            this.animateInfoBox()
            gsap.delayedCall(this.parameters.skillsAdditionalDelay, () => this.animateSkillsBox())
            gsap.delayedCall(this.parameters.aboutAdditionalDelay, () => this.animateAboutBox())
        })
    }

    animateInfoBox() {
        // Lines
        this.fillLine(document.querySelectorAll('.about-box-line')[0], .25)
        this.fillLine(document.querySelectorAll('.about-box-line')[1], .25)
        this.fillLine(document.querySelectorAll('.about-box-line')[2], .45)
        this.fillLine(document.querySelectorAll('.about-box-line')[3], .45)

        // Span Headers
        gsap.fromTo(document.getElementById('about-header-name'), { opacity: 0 }, { opacity: 1, duration: .2, delay: .2 })
        gsap.fromTo(document.getElementById('about-header-age'), { opacity: 0 }, { opacity: 1, duration: .2, delay: .35 })
        gsap.fromTo(document.getElementById('about-header-from'), { opacity: 0 }, { opacity: 1, duration: .2, delay: .5 })

        // Spans
        this.animateSpan(this.animatedSpans.infoDavid, 0.3)
        this.animateSpan(this.animatedSpans.info23, 0.45)
        this.animateSpan(this.animatedSpans.infoGermany, 0.6)

        // Backgrounds
        gsap.fromTo(document.getElementById('about-header-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn, delay: .35 })
        gsap.fromTo(document.getElementById('about-profile-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })

        // Profile Picture
        this.domElements.profilePictureMaskRect.classList.remove('no-transition')
        this.domElements.profilePictureMaskRect.style.transform = 'translateY(-205px)'

        //Move gradient with Profile picture
        this.domElements.profilePictureGradient.classList.remove('no-transition')
        this.domElements.profilePictureGradient.style.transform = 'translateY(-205px)'
    }

    animateSkillsBox() {
        //Lines
        this.fillLine(document.querySelectorAll('.about-box-line')[4], 0)
        this.fillLine(document.querySelectorAll('.about-box-line')[5], 0)

        //Skill Bars
        for (let i = 0; i < this.skills.length; i++) {
            //Fade in rows from top to bottom
            gsap.fromTo(document.getElementById('about-skill-container-' + i), { opacity: 0 }, { opacity: 1, duration: .3, delay: i / 10 })
            //fill bars
            gsap.fromTo(document.getElementById('about-skill-bar-' + i).style, { width: '0%' }, { width: this.skills[i].width, duration: .3, delay: i / 10 })
        }

        // Background
        gsap.fromTo(document.getElementById('about-skills-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })

        //Header
        gsap.fromTo(this.domElements.skillsHeaderRect, { width: 0 }, { width: 500, duration: .5, ease: Power2.easeIn })
    }

    animateAboutBox() {
        //Lines
        this.fillLine(document.querySelectorAll('.about-box-line')[6], 0)
        this.fillLine(document.querySelectorAll('.about-box-line')[7], 0)

        // Background
        gsap.fromTo(document.getElementById('about-about-background'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: Power2.easeIn })

        //Header
        gsap.fromTo(this.domElements.aboutHeaderRect, { width: 0 }, { width: 500, duration: .5, ease: Power2.easeIn })

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





    // ------------------------ Animations ---------------------------------------------------------------------------------------------- 

    fadeInHologramUI(delay) {
        gsap.fromTo(this.domElements.headerGroup, { opacity: 0 }, { opacity: 1, duration: .2, delay: delay })
        gsap.fromTo(this.domElements.skillsGroup, { opacity: 0 }, { opacity: 1, duration: .2, delay: delay + this.parameters.skillsAdditionalDelay })
        gsap.fromTo(this.domElements.aboutGroup, { opacity: 0 }, { opacity: 1, duration: .2, delay: delay + this.parameters.aboutAdditionalDelay })
    }

    fillLine(line, delay = 0) {
        //check if line is rendered
        if (line.getClientRects().length != 0) {
            const lineLength = line.getTotalLength()

            //adapt strok dasharray
            line.style.strokeDasharray = lineLength

            //fill animation
            gsap.fromTo(line.style, { strokeDashoffset: lineLength }, { strokeDashoffset: 0, duration: .6, delay: delay })
        }
    }

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
}