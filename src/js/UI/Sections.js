import Experience from '../Experience'

export default class Sections {

    domElements = {
        aboutContainer: document.getElementById('about-section'),
        workContainer: document.getElementById('work-section'),
        contactContainer: document.getElementById('')
    }

    sections = [
        { name: 'about', y: 0, container: document.getElementById('about-section') },
        { name: 'work', y: 0, container: document.getElementById('work-section') },
        { name: 'contact', y: 0, container: document.getElementById('contact-section') }
    ]

    constructor() {
        this.experience = new Experience()

        this.setSectionsY()
    }

    setSectionsY() {
        this.sections.forEach((section) => {
            //Reset Y
            section.y = 0

            //Get height of all sections and apply
            for (let i = 0; i < this.sections.length; i++) {
                if (i < this.sections.indexOf(section)) {
                    section.y += this.getAbsoluteHeight(this.sections[i].container)
                }
            }

            //Add sections margin-top
            section.y += this.getMarginTop(section.container)
        })
    }

    getAbsoluteHeight(element) {
        const styles = window.getComputedStyle(element)
        const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom'])

        return Math.ceil(element.offsetHeight + margin)
    }

    getMarginTop(element) {
        const styles = window.getComputedStyle(element)

        return Math.ceil(parseFloat(styles['marginTop']))
    }

    resize() {
        this.setSectionsY()
    }
}