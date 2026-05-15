export function createGalaxyPlanetElements({skills, planetsRoot, popup, popupTitle, popupDescription}) {
    const planetLinks = [];
    let popupTimer;

    skills.forEach(skill => {
        const planet = document.createElement('div');
        planet.className = 'g-planet';
        planet.style.setProperty('--planet-glow', skill.glow);
        planet.innerHTML = `<div class="g-planet-icon" style="background:${skill.bg};"><i class="${skill.icon}" style="color:#fff;${skill.iconStyle || ''}"></i></div><span class="g-planet-name">${skill.name}</span>`;

        planet.addEventListener('click', event => {
            event.stopPropagation();
            popupTitle.innerHTML = `<i class="${skill.icon}" style="color:${skill.bg};${skill.iconStyle || ''}"></i> ${skill.name}`;
            popupDescription.textContent = skill.desc;

            const bounds = planet.getBoundingClientRect();
            popup.style.left = Math.min(bounds.left, window.innerWidth - 240) + 'px';
            popup.style.top = (bounds.bottom + 8) + 'px';
            popup.classList.add('show');

            clearTimeout(popupTimer);
            popupTimer = setTimeout(() => popup.classList.remove('show'), 3500);
        });

        planetsRoot.appendChild(planet);
        planetLinks.push({element: planet, skill});
    });

    document.addEventListener('click', () => popup.classList.remove('show'));

    return planetLinks;
}