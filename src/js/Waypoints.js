import Experience from './Experience'
import { gsap, Power2 } from 'gsap'

export default class Waypoints {

    waypoints = [
        {
            name: 'landing-page',
            position: {x: 5.8, y: 0, z: 8.3},
            lookAt: {x: -2.7, y: -3.7, z: 0},
        },
        {
            name: 'landing-menu',
            position: { x: -7, y: 0, z: 7.5 },
            lookAt: { x: 1, y: -3.7, z: 0 },
        },
        {
            name: 'scroll-start',
            position: {x: 5.8, y: -10, z: 8.3},
            lookAt: {x: -2.7, y: -13.7, z: 0},
        }
    ]

    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera.instance
        this.debug = this.experience.debug
        this.time = this.experience.time

        this.setupWaypoints()
        this.moveToWaypoint('landing-page', false)
    }

    setupWaypoints() {
        this.waypoints.forEach((waypoint) => {
            this.camera.position.set(waypoint.position.x, waypoint.position.y, waypoint.position.z)
            this.camera.lookAt(waypoint.lookAt.x, waypoint.lookAt.y, waypoint.lookAt.z)

            waypoint.rotation = {}
            waypoint.rotation.x = this.camera.rotation.x
            waypoint.rotation.y = this.camera.rotation.y
            waypoint.rotation.z = this.camera.rotation.z
        })
    }

    moveToWaypoint(waypointName, withAnimation = true, mDuration = .8) {
        const waypoint = this.waypoints.find((waypoint) => waypoint.name === waypointName)

        // console log details if debug is active 
        if (this.debug.active) {
            console.log('%c Moving to waypoint: ' + waypoint.name + ' at ' + this.time.current, 'color: #bada55')
        }

        if (withAnimation) {
            // move with animation
            //position
            gsap.to(this.camera.position, {
                x: waypoint.position.x,
                y: waypoint.position.y,
                z: waypoint.position.z,
                duration: mDuration,
                ease: Power2.easeInOut
            })

            //rotation
            gsap.to(this.camera.rotation, {
                x: waypoint.rotation.x,
                y: waypoint.rotation.y,
                z: waypoint.rotation.z,
                duration: mDuration,
                ease: Power2.easeInOut,
            })
        } else {
            // move without animation 
            this.camera.position.set(waypoint.position.x, waypoint.position.y, waypoint.position.z)
            this.camera.rotation.set(waypoint.rotation.x, waypoint.rotation.y, waypoint.rotation.z)
        }
    }
}