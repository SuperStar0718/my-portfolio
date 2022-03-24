import { gsap } from "gsap"
import Experience from '../../Experience'

export default class ContactForm {

    domElements = {
        submitButton: document.getElementById('contact-submit-button'),
        formContainer: document.getElementById('contact-form-container'),
        loadingContainer: document.getElementById('contact-loading-container'),
        resultContainer: document.getElementById('contact-result-container'),
        resultMessage: document.getElementById('contact-result-message-container'),
        resultButton: document.getElementById('contact-result-button'),
        errorLines: document.querySelectorAll('.contact-error-line'),
        successLine: document.getElementById('contact-success-line'),
    }

    fields = [
        {
            input: document.getElementById('contact-name-input-field'),
            container: document.getElementById('contact-name-input'),
        },
        {
            input: document.getElementById('contact-email-input-field'),
            container: document.getElementById('contact-email-input')
        },
        {
            input: document.getElementById('contact-message-input-field'),
            container: document.getElementById('contact-message-input')
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.sections = this.experience.ui.sections
        this.scroll = this.experience.ui.scroll

        this.addSubmitButtonEventListener()
        this.addHideErrorEventListeners()
        this.addResultButtonEventListener()
        this.initTabEvents()
    }

    initTabEvents() {
        window.addEventListener('keydown', () => {
            if (event.keyCode == 9) {
                event.preventDefault()

                this.fields.forEach((field) => {
                    if (field.input === document.activeElement) {
                        this.focusNext(this.fields.indexOf(field))
                    }
                })

            }
        })
    }

    focusNext(currentIndex) {
        if (this.scroll.scrollY + (window.innerHeight / 3) >= this.sections.sections[2].y) {
            const nextInput = this.fields[currentIndex + 1 == this.fields.length ? 0 : currentIndex + 1].input

            setTimeout(() => {
                nextInput.focus()
            })
        }
    }

    addSubmitButtonEventListener() {
        this.domElements.submitButton.addEventListener('click', () => {
            this.hideAllErrors()

            //Start form validation
            this.checkNameInput()
        })
    }

    addHideErrorEventListeners() {
        this.fields.forEach((field) => {
            //Events
            field.container.addEventListener('focusin', () => this.hideError(field))
            field.input.addEventListener('input', () => this.hideError(field))
        })
    }

    addResultButtonEventListener() {
        this.domElements.resultButton.addEventListener('click', () => {
            this.showContainer('form')

            if (this.domElements.errorLines[0].classList.contains('hide')) {
                this.clearInputs()
            }
        })
    }

    hideAllErrors() {
        this.fields.forEach((field) => this.hideError(field))
    }

    hideError(field) {
        const errorLabel = document.querySelectorAll('.error-label')[this.fields.indexOf(field)]
        errorLabel.classList.add('hide')

        field.container.classList.remove('error-container')
    }

    showError(field) {
        const errorLabel = document.querySelectorAll('.error-label')[this.fields.indexOf(field)]
        errorLabel.classList.remove('hide')

        field.container.classList.add('error-container')
    }

    checkNameInput() {
        const field = this.fields[0]

        if (field.input.value.length >= 4) {
            this.checkEmailInput()
        } else {
            this.showError(field)
        }
    }

    checkEmailInput() {
        const field = this.fields[1]

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(field.input.value)) {
            this.checkMessageInput()
        } else {
            this.showError(field)
        }
    }

    checkMessageInput() {
        const field = this.fields[2]

        if (field.input.value.length >= 10) {
            this.sendMail()
        } else {
            this.showError(field)
        }
    }

    async sendMail() {
        const formData = new FormData()
        formData.append('name', this.fields[0].input.value)
        formData.append('message',
            `Email: ${this.fields[1].input.value}
            
            Message: 

            ${this.fields[2].input.value}`
        )

        this.showContainer('loading')
        this.showResult(await fetch('https://david-hckh.com/dvPUgZZmtUufcKM59gv9zX4NiNKQqGs5.php', { method: 'POST', body: formData }))
    }

    hideAllContainers() {
        this.domElements.formContainer.classList.add('hide')
        this.domElements.resultContainer.classList.add('hide')
        this.domElements.loadingContainer.classList.add('hide')
    }

    showContainer(name) {
        this.hideAllContainers()

        gsap.fromTo(this.domElements[name + 'Container'], { opacity: 0 }, { opacity: 1, duration: .2 })
        this.domElements[name + 'Container'].classList.remove('hide')
    }

    showResult(result) {
        const statusCode = Math.floor(result.status / 100)

        this.showContainer('result')

        this.domElements.resultMessage.innerHTML = statusCode == 2 ?
            `<h4>Your message has been sent.</h4><span>I'll get back to you as soon as possible.</span>` :
            `<h4>Oops. An error occurred.</h4><span>Please try again.</span>`

        this.domElements.resultButton.innerHTML = statusCode == 2 ? 'Cool!' : 'Try again'

        statusCode == 2 ? this.showSuccessIcon() : this.showErrorIcon()
    }

    showSuccessIcon() {
        this.domElements.successLine.classList.remove('hide')
        this.domElements.errorLines.forEach((line) => line.classList.add('hide'))

        this.fillLine(this.domElements.successLine)
    }

    showErrorIcon() {
        this.domElements.successLine.classList.add('hide')
        this.domElements.errorLines.forEach((line) => line.classList.remove('hide'))

        let delay = 0
        this.domElements.errorLines.forEach((line) => {
            this.fillLine(line, delay, .3)
            delay += .3
        })
    }

    clearInputs() {
        this.fields.forEach((field) => field.input.value = '')
    }

    fillLine(line, delay = 0, duration = .5) {
        //check if line is rendered
        if (line.getClientRects().length != 0) {
            const lineLength = line.getTotalLength()

            //adapt strok dasharray
            line.style.strokeDasharray = lineLength

            //fill animation
            gsap.fromTo(line.style, { strokeDashoffset: lineLength }, { strokeDashoffset: 0, duration: duration, delay: delay })
        }
    }

}