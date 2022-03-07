import Experience from '../../Experience'

export default class MenuItems {

    items = [
        {
            name: 'home',
            menuItem: document.querySelectorAll('.menu-item')[0],
            y: 'landing',
        },
        {
            name: 'about',
            menuItem: document.querySelectorAll('.menu-item')[1],
            y: 0,
        },
        {
            name: 'work',
            menuItem: document.querySelectorAll('.menu-item')[2],
            y: 500,
        },
        {
            name: 'contact',
            menuItem: document.querySelectorAll('.menu-item')[3],
            y: 1000,
        },
    ]

    constructor() {
        this.experience = new Experience()
        this.transition = this.experience.ui.transition
        
        this.addClickEventListeners()
    }

    addClickEventListeners() {
        this.items.forEach((item) => {
            item.menuItem.addEventListener('click', () => {
                if (!item.menuItem.classList.contains('active-menu-item')) {
                    this.transition.show()
                    setTimeout(() => this.transition.hide(),  900)
                }
            })
        })
    }
}