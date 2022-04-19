import Experience from "../../Experience";

export default class Speaker {
    constructor() {
        this.experience = new Experience()
        this.room = this.experience.world.landingPage.room
        this.sounds = this.experience.sounds

        this.model = this.room.speaker

        //Hover Icon
        this.model.hoverIcon = 'pointer'

        //de/-activate sound on click
        this.model.onClick = () => {
            if (!this.experience.ui.intro.clickCTAVisible) {
                const soundButton = this.experience.ui.soundButton

                soundButton.active ? soundButton.deactivate() : soundButton.activate()

                this.sounds.play('buttonClick')
            }
        }
    }
}