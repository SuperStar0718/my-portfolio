import Experience from "../../Experience"
import { gsap } from 'gsap'

export default class Penguin {
    constructor() {
        this.experience = new Experience()
        this.sounds = this.experience.sounds

        //Model
        this.model = this.experience.world.landingPage.room.penguin

        //Wings
        this.wings = [
            this.model.children[0],
            this.model.children[1],
        ]

        //Jump on hover
        this.model.onHover = () => this.jump()
    }


    jump() {
        if (!this.isJumping) {
            this.isJumping = true
            gsap.delayedCall(.8, () => this.isJumping = false)

            //Position
            gsap.to(this.model.position, { y: 2, yoyo: true, repeat: 1, duration: .4 })

            //Wings
            gsap.to(this.wings[0].rotation, { x: .4, duration: .1, repeat: 7, yoyo: true })
            gsap.to(this.wings[1].rotation, { x: -.4, duration: .1, repeat: 7, yoyo: true })

            this.sounds.play('bird')

        }
    }
}