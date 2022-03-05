import Experience from '../Experience'
import LandingPage from './LandingPage'
import Scroll from './Scroll'
import Transition from './Transition'
import WorkCards from './Work/Cards'
import WorkRender from './Work/Render'
import SkillsRender from './About/Render'
import AboutTabbedContent from './About/TabbedContent'
import HoverIcon from './HoverIcon'
import Header from './Header'
import AboutIcons from './About/Icons'
import Menu from './Menu'
import ScrollIcon from './SrollIcon'

export default class UI {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.world = this.experience.world

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.transition = new Transition()
            this.landingPage = new LandingPage()
            this.scroll = new Scroll()
            this.menu = new Menu()
            this.scrollIcon = new ScrollIcon()

            //About
            this.about = {}
            this.about.render = new SkillsRender()
            this.about.icons = new AboutIcons()
            this.about.tabbedContent = new AboutTabbedContent()

            //Work
            this.work = {}
            this.work.render = new WorkRender()
            this.work.cards = new WorkCards()

            //Contact
            this.contact = {}

            this.header = new Header()
            this.hoverIcon = new HoverIcon()
        })
    }

    update() {

    }

    resize() {
        if (this.scroll)
            this.scroll.resize()
    }
}