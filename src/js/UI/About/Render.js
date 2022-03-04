import skills from './skills'

export default class SkillsRender {

    domElements = {
        skillsRenderContainer: document.getElementById('about-skills-render-container'),
        othersRenderContainer: document.getElementById('about-others-render-container'),
    }
    
    constructor() {
        this.skills = skills

        //Clear example 
        this.domElements.skillsRenderContainer.innerHTML = ''

        this.renderSkills() 
    }

    renderSkills() {
        this.skills.forEach((skill) => {
            const renderContainer = skill.category == 'main' ? this.domElements.skillsRenderContainer : this.domElements.othersRenderContainer

            renderContainer.insertAdjacentHTML('beforeend', `
                <div id="about-skill-container-${this.skills.indexOf(skill)}" class="row about-skill-container">
                    <span id="about-skill-span-${this.skills.indexOf(skill)}" class="about-skill-span">${skill.name}</span>
                    <div class="about-skill-bar-container">
                        <div id="about-skill-bar-${this.skills.indexOf(skill)}" class="about-skill-bar" style="width: ${skill.width}"></div>
                    </div>
                </div>
            `)
        })
    }

}