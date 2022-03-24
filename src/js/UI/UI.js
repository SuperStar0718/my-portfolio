import Experience from '../Experience'
import LandingPage from './LandingPage'
import Scroll from './Scroll'
import Transition from './Transition'
import WorkCards from './Work/Cards'
import WorkRender from './Work/Render'
import SkillsRender from './About/Render'
import HoverIcon from './HoverIcon'
import Header from './Header'
import MenuMain from './Menu/Main'
import ScrollIcon from './SrollIcon'
import SoundButton from './SoundButton'
import AboutAnimations from './About/Animations'
import MenuItems from './Menu/Items'
import Sections from './Sections'
import ContactForm from './Contact/ContactForm'
import ContactAnimationEvents from './Contact/AnimationEvents'
import Intro from './Intro'

export default class UI {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.world = this.experience.world
        this.sizes = this.experience.sizes

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.transition = new Transition()
            this.scrollIcon = new ScrollIcon(document.querySelector('.scroll-icon'))
            this.scrollScrollIcon = new ScrollIcon(document.querySelectorAll('.scroll-icon')[1], true)
            this.landingPage = new LandingPage()
            this.scroll = new Scroll()
            this.sections = new Sections()
            this.soundButton = new SoundButton()

            //Menu 
            this.menu = {}
            this.menu.main = new MenuMain()
            this.menu.items = new MenuItems()

            //About
            this.about = {}
            this.about.render = new SkillsRender()
            this.about.animations = new AboutAnimations()

            //Work
            this.work = {}
            this.work.render = new WorkRender()
            this.work.cards = new WorkCards()

            //Contact
            this.contact = {}
            this.contact.form = new ContactForm()
            this.contact.animationEvents = new ContactAnimationEvents()

            this.header = new Header()
            this.hoverIcon = new HoverIcon()

            this.intro = new Intro()
        })
    }

    update() {

    }

    resize() {
        if (this.scroll)
            this.scroll.resize()

        if (this.scrollbar)
            this.scrollbar.resize()

        if (this.menu) if (this.menu.main)
            this.menu.main.resize()

        if (this.sections)
            this.sections.resize()

        if (this.about) if (this.about.animations)
            this.about.animations.resize()

        if (this.contact) if (this.contact.animationEvents)
            this.contact.animationEvents.resize()
    }
}