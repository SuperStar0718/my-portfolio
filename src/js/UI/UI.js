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
import Menu from './Menu'
import ScrollIcon from './SrollIcon'
import ScrollBar from './ScrollBar'
import Sound from './Sound'
import AboutAnimations from './About/Animations'

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
            //this.scrollbar = new ScrollBar()
            this.menu = new Menu()
            this.sound = new Sound()

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

        if(this.menu) 
            this.menu.resize()
    }
}