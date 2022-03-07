export default class AboutIcons {

    icons = [
        {
            //Baby Icon
            domElement: 'about-icon-0',
            pixels: [
                '8 3', '9 3', '10 3', '11 3', '12 3',
                '7 4', '8 4', '9 4', '10 4', '11 4', '12 4', '13 4',
                '6 5', '7 5', '8 5', '9 5', '11 5', '12 5', '13 5', '14 5',
                '5 6', '8 6', '9 6', '10 6', '13 6', '15 6',
                '4 7', '9 7', '10 7', '11 7', '12 7', '16 7',
                '4 8', '16 8',
                '3 9', '17 9',
                '2 10', '3 10', '17 10', '18 10',
                '1 11', '3 11', '17 11', '19 11',
                '1 12', '3 12', '7 12', '13 12', '17 12', '19 12',
                '2 13', '3 13', '7 13', '13 13', '17 13', '18 13',
                '4 14', '9 14', '10 14', '11 14', '16 14',
                '4 15', '8 15', '12 15', '16 15',
                '5 16', '8 16', '10 16', '12 16', '15 16',
                '6 17', '7 17', '8 17', '9 17', '11 17', '12 17', '13 17', '14 17',
                '9 18', '10 18', '11 18'
            ]
        },
        {
            //Heart Icon
            domElement: 'about-icon-1',
            pixels: [
                '4 3', '5 3', '6 3', '11 3', '12 3', '13 3',
                '3 4', '7 4', '10 4', '14 4',
                '2 5', '8 5', '9 5', '15 5',
                '1 6', '16 6',
                '1 7', '16 7',
                '1 8', '16 8',
                '1 9', '16 9',
                '2 10', '15 10',
                '2 11', '15 11',
                '3 12', '14 12',
                '4 13', '13 13',
                '5 14', '12 14',
                '6 15', '11 15',
                '7 16', '10 16',
                '8 17', '9 17'
            ]
        },
        {
            //Rocket Icon
            domElement: 'about-icon-2',
            pixels: [
                '14 1', '15 1', '16 1', '17 1', '18 1',
                '12 2', '13 2', '19 2',
                '10 3', '11 3', '19 3',
                '4 4', '9 4', '14 4', '15 4', '16 4', '19 4',
                '3 5', '5 5', '8 5', '14 5', '15 5', '16 5', '19 5',
                '2 6', '6 6', '7 6', '14 6', '15 6', '16 6', '19 6',
                '1 7', '6 7', '18 7',
                '1 8', '3 8', '4 8', '5 8', '18 8',
                '1 9', '2 9', '5 9', '17 9',
                '5 10', '16 10',
                '5 11', '15 11',
                '4 12', '6 12', '13 12', '14 12',
                '4 13', '7 13', '11 13', '12 13', '13 13',
                '2 14', '3 14', '4 14', '5 14', '8 14', '9 14', '10 14', '14 14',
                '1 15', '5 15', '6 15', '7 15', '11 15', '15 15',
                '1 16', '5 16', '11 16', '14 16',
                '1 17', '5 17', '10 17', '13 17',
                '1 18', '2 18', '3 18', '4 18', '10 18', '11 18', '12 18'
            ]
        }
    ]

    constructor() {
        this.renderIcons()
    }

    renderIcons() {
        this.icons.forEach((icon) => {
            const renderContainer = document.getElementById(icon.domElement)

            for (let i = 0; i < icon.pixels.length; i++) {
                renderContainer.insertAdjacentHTML('beforeend', `<use class="pixel pixel-${this.icons.indexOf(icon)}-y-${icon.pixels[i].split(' ')[1]}" href="#pixel" x="${icon.pixels[i].split(' ')[0] * 4}" y="${icon.pixels[i].split(' ')[1] * 4}"></use>`)
            }
        })
    }

    playPixelAnimation(index, delay) {
        //define pixelRows
        let pixelRows = []

        for (let i = 0; i < 20; i++) {
            pixelRows.push(document.querySelectorAll('.pixel-' + index + '-y-' + i))
        }

        //Hide all
        for (let i = 0; i < pixelRows.length; i++) {
            const row = pixelRows[i]
            row.forEach((pixel) => pixel.style.opacity = 0)
        }

        //Show rows
        setTimeout(() => {
            for (let i = 0; i < pixelRows.length; i++) {
                const row = pixelRows[i]
                setTimeout(() => {
                    row.forEach((pixel) => pixel.style.opacity = 1)
                }, i * 15)
            }
        }, delay * 1000)
    }
}