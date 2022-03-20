import Experience from '../Experience.js'
import Room from './Room/Room.js'
import RoomShadow from './Room/RoomShadow.js'
import Desktops from './Room/Desktops'
import Lab from './Lab/Lab'
import LabShadow from './Lab/LabShadow'
import Tube from './Lab/Tube.js'
import LabScreen from './Lab/Screen.js'
import Drop from './Lab/Drop.js'
import Bubbles from './Lab/Bubbles'
import TestTubes from './Lab/TestTubes.js'
import Background from './Background'
import Character from './Character/Character.js'
import Mouse from './Room/Mouse'
import MessagePopUp from './Room/MessagePopUp.js'
import ContactScene from './Contact/ContactScene.js'
import ContactShadow from './Contact/ContactShadow.js'
import David from './Contact/David.js'
import SceneFog from './Fog.js'
import ContactAnimation from './Contact/ContactAnimation.js'
import ExclamationMark from './Contact/ExclamationMark.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug


        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.fog = new SceneFog()
            this.background = new Background()

            //Landing Page
            this.landingPage = {}
            this.landingPage.roomShadow = new RoomShadow()
            this.landingPage.room = new Room()
            this.landingPage.desktops = new Desktops()
            this.landingPage.mouse = new Mouse()
            this.landingPage.messagePopUp = new MessagePopUp()

            // Skills
            this.lab = {}
            this.lab.model = new Lab()
            this.lab.shadow = new LabShadow()
            this.lab.tube = new Tube()
            this.lab.screen = new LabScreen()
            this.lab.drop = new Drop()
            this.lab.bubbles = new Bubbles()
            this.lab.testTubes = new TestTubes()

            //Contact
            this.contact = {}
            this.contact.scene = new ContactScene()
            this.contact.shadow = new ContactShadow()
            this.contact.david = new David()
            this.contact.exclamationMark = new ExclamationMark()

            this.character = new Character()

            this.contact.animation = new ContactAnimation()
        })
    }

    update() {
        if (this.character)
            this.character.update()

        if (this.lab) if (this.lab.screen)
            this.lab.screen.update()
    }
}