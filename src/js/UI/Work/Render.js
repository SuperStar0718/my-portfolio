import items from './items.js'
import tags from './tags.js'
import Experience from '../../Experience.js'

export default class WorkRender {

    renderContainer = document.getElementById('work-render-container')

    constructor() {
        this.experience = new Experience()
        this.items = items
        this.tags = tags

        this.renderItems()
    }

    renderItems() {
        this.items.forEach((item) => {
            this.renderContainer.insertAdjacentHTML('beforeend', `
                <svg id="work-item-${item.id}" class="work-card-svg" viewBox="0 0 320 550" xmlns="http://www.w3.org/2000/svg">
                    <foreignObject x="0" y="0" width="320" height="550" requiredExtensions="http://www.w3.org/1999/xhtml">
                        <div class="work-item-container column">
                            <img class="work-item-image" src="${item.image}">
                            <div class="work-item-content-container">
                                <h3>${item.name}</h3>
                                <div class="work-item-tag-container row">
                                    ${this.renderTags(item.tags)}
                                </div>
                                <span>${item.description}</span>
                            </div>
                            <div class="work-item-button-container row">
                                <div id="work-item-gray-button-${item.id}" class="work-item-gray-button center">Github</div>
                                <div id="work-item-orange-button-${item.id}" class="work-item-orange-button small-button center">Live View</div>
                            </div>
                        </div>
                    </foreignObject>
                </svg>
            `)

            this.addEventListenersToCard(item)
        })
    }

    renderTags(tags) {
        let contentToReturn = ''

        //get requested tag from tags.js file
        for (let i = 0; i < tags.length; i++) {
            contentToReturn += this.tags[tags[i]]
        }

        return contentToReturn
    }


    addEventListenersToCard(item) {
        const container = document.getElementById('work-item-' + item.id)

        // Inactive Container click
        container.addEventListener('click', () => {
            if (container.classList.contains('work-inactive-item-container')) {
                this.experience.ui.work.cards.currentItemIndex = -item.id + 4
                this.experience.ui.work.cards.updatePositions()
            }
        })

        // Gray button click
        document.getElementById('work-item-gray-button-' + item.id).addEventListener('click', () => {
            if (!container.classList.contains('work-inactive-item-container')) {
                window.open(item.github, '_blank').focus()
            }
        })

        // orange button click
        document.getElementById('work-item-orange-button-' + item.id).addEventListener('click', () => {
            if (!container.classList.contains('work-inactive-item-container')) {
                window.open(item.liveview, '_blank').focus()
            }
        })
    }
} 