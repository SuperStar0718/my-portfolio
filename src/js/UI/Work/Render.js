import items from './items.js'
import tags from './tags.js'
import Experience from '../../Experience.js'

export default class WorkRender {

    domElements = {
        renderContainer: document.getElementById('work-render-container')
    }

    constructor() {
        this.experience = new Experience()
        this.sounds = this.experience.sounds

        this.items = items
        this.tags = tags

        this.renderItems()
    }

    renderItems() {
        this.items.forEach((item) => {
            this.domElements.renderContainer.insertAdjacentHTML('beforeend', `
            <div id="work-item-${item.id}" class="work-item-container column">
                <img class="work-item-image" src="${item.image}" alt="${item.alt}"/>
                <div class="work-item-content-container">
                    <h3>${item.name}</h3>
                    <div class="work-item-tag-container row">
                        ${this.renderTags(item.tags)}
                    </div>
                    <span>${item.description}</span>
                </div>
                <div class="work-item-button-container row">
                    <div id="work-item-gray-button-${item.id}" class="work-item-gray-button center gray-hover" ${item.liveview ? '' : 'style="width: 100%"'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"  class="code-icon">
                            <use href="#code-path"/>
                        </svg>
                        ${item.liveview ? '' : '<span>Source Code</span>'}
                    </div>
                    ${item.liveview ? `<div id="work-item-orange-button-${item.id}" class="work-item-orange-button small-button center orange-hover">Live View</div>` : ''}
                </div>
            </div>
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
                this.sounds.play('buttonClick')
            }
        })

        // Gray button click
        document.getElementById('work-item-gray-button-' + item.id).addEventListener('click', () => {
            window.open(item.github, '_blank').focus()
        })

        // orange button click
        if (item.liveview) {
            document.getElementById('work-item-orange-button-' + item.id).addEventListener('click', () => {
                window.open(item.liveview, '_blank').focus()
            })
        }
    }
} 