import Experience from "../../Experience"
import * as THREE from 'three'

export default class Mouse {
    constructor() {
        this.experience = new Experience()
        this.room = this.experience.world.landingPage.room

        this.setModel()
        this.setIdleStartPosition()
    }

    setModel() {
        this.model = this.room.model.children.find((children) => children.name === 'mouse')
        this.model.position.z += 2.229

        this.room.baseModel.add(this.model)

        //Adjust positioning to hand
        this.model.position.x += 0.15
        this.model.position.z += 0.07
    }

    setIdleStartPosition() {
        this.model.idleStartPosition = {
            x: this.model.position.x,
            z: this.model.position.z,
        }
    }

    // Set mouse position back to initial one (for section 1 transition)
    moveToIdleStartPositon() {
        this.model.position.x = this.model.idleStartPosition.x
        this.model.position.z = this.model.idleStartPosition.z
    }

    updateMouseSync() {
        const mouseBone = this.experience.world.character.model.children[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[0]
        let position = mouseBone.getWorldPosition(new THREE.Vector3())

        const leftBorder = 0.2
        const rightBorder = 0.6

        if (position.y < 1.63 - 5.7 && position.y > 1.58 - 5.7 && position.x > leftBorder && position.x < rightBorder) {
            this.model.position.z = -position.x - 1.849 + 2.229
            this.model.position.x = position.z + 0.92
        }
    }
}