import Experience from '../Experience'
import LandingPage from './LandingPage'
import Scroll from './Scroll'
import Transition from './Transition'
import WorkCards from './Work/Cards'
import WorkRender from './Work/Render'
import SkillsRender from './About/Render'
import HoverIcon from './HoverIcon'
import Header from './Header'
import AboutIcons from './About/Icons'
import MenuMain from './Menu/Main'
import ScrollIcon from './SrollIcon'
import ScrollBar from './ScrollBar'
import SoundButton from './SoundButton'
import AboutAnimations from './About/Animations'
import MenuItems from './Menu/Items'
import Sections from './Sections'
import ContactForm from './ContactForm'

export default class UI {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.world = this.experience.world

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.transition = new Transition()
            this.scrollIcon = new ScrollIcon('landing-scroll-icon', 'landing-scroll-wheel')
            this.landingPage = new LandingPage()
            this.scroll = new Scroll()
            this.sections = new Sections()
            //this.scrollbar = new ScrollBar()
            this.soundButton = new SoundButton()

            //Menu 
            this.menu = {}
            this.menu.main = new MenuMain()
            this.menu.items = new MenuItems()

            //About
            this.about = {}
            this.about.render = new SkillsRender()
            this.about.icons = new AboutIcons()
            this.about.animations = new AboutAnimations()

            //Work
            this.work = {}
            this.work.render = new WorkRender()
            this.work.cards = new WorkCards()

            //Contact
            this.contact = {}
            this.contact.form = new ContactForm()

            this.header = new Header()
            this.hoverIcon = new HoverIcon()
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
    }
}