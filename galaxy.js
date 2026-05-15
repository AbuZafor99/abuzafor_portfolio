import * as THREE from 'three';
import {GALAXY_ORBITS, GALAXY_SKILLS} from './galaxy-data.js';
import {createCoreGlow, createOrbitalPath, createStarField} from './galaxy-effects.js';
import {createGalaxyPlanetElements} from './galaxy-ui.js';

function initGalaxy() {
    const wrap = document.getElementById('galaxyWrap');
    const canvas = document.getElementById('galaxyCanvas');
    const planetsRoot = document.getElementById('galaxyPlanets');
    const popup = document.getElementById('skillPopup');
    const popupTitle = document.getElementById('popTitle');
    const popupDescription = document.getElementById('popDesc');

    if (!wrap || !canvas || !planetsRoot || !popup || !popupTitle || !popupDescription) {
        return;
    }

    const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    const coreGlows = createCoreGlow(scene);
    const planetState = [];

    let width = wrap.clientWidth || 560;
    let height = wrap.clientHeight || 440;
    let animationTime = 0;
    let isDragging = false;
    let dragX = 0;
    let dragY = 0;
    let cameraAngle = 0;
    let cameraTilt = 0.7;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.set(0, 10, 4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    scene.add(new THREE.PointLight(0x00e5a0, 2, 20, 1.5));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.1));

    createStarField(scene);
    GALAXY_ORBITS.forEach(orbit => createOrbitalPath(scene, orbit.radius, orbit.color));

    const planetElements = createGalaxyPlanetElements({
        skills: GALAXY_SKILLS,
        planetsRoot,
        popup,
        popupTitle,
        popupDescription
    });

    GALAXY_SKILLS.forEach((skill, index) => {
        const orbit = GALAXY_ORBITS[skill.orbit];
        const anchor = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 8),
            new THREE.MeshBasicMaterial({visible: false})
        );

        scene.add(anchor);
        planetState.push({
            anchor,
            element: planetElements[index].element,
            orbitRadius: orbit.radius,
            speed: orbit.speed,
            angle: skill.startAngle
        });
    });

    const updatePointerDrag = (clientX, clientY) => {
        if (!isDragging) {
            return;
        }

        cameraAngle -= (clientX - dragX) * 0.007;
        cameraTilt += (clientY - dragY) * 0.004;
        cameraTilt = Math.max(0.15, Math.min(1.2, cameraTilt));
        dragX = clientX;
        dragY = clientY;
    };

    canvas.addEventListener('mousedown', event => {
        isDragging = true;
        dragX = event.clientX;
        dragY = event.clientY;
    });
    window.addEventListener('mousemove', event => updatePointerDrag(event.clientX, event.clientY));
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('touchstart', event => {
        isDragging = true;
        dragX = event.touches[0].clientX;
        dragY = event.touches[0].clientY;
    }, {passive: true});
    canvas.addEventListener('touchmove', event => {
        updatePointerDrag(event.touches[0].clientX, event.touches[0].clientY);
    }, {passive: true});
    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });

    const resize = () => {
        width = wrap.clientWidth || 560;
        height = wrap.clientHeight || 440;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    const animate = () => {
        requestAnimationFrame(animate);
        animationTime += 0.01;

        if (!isDragging) {
            cameraAngle += 0.0012;
        }

        const distance = 12;
        camera.position.x = Math.sin(cameraAngle) * Math.cos(cameraTilt) * distance;
        camera.position.y = Math.sin(cameraTilt) * distance;
        camera.position.z = Math.cos(cameraAngle) * Math.cos(cameraTilt) * distance;
        camera.lookAt(0, 0, 0);

        const pulse = 1 + Math.sin(animationTime * 2) * 0.1;
        coreGlows.primaryGlow.scale.set(3 * pulse, 3 * pulse, 1);

        planetState.forEach(planet => {
            planet.angle += planet.speed * 0.008;
            planet.anchor.position.set(
                Math.cos(planet.angle) * planet.orbitRadius,
                0,
                Math.sin(planet.angle) * planet.orbitRadius
            );

            const worldPosition = planet.anchor.position.clone();
            worldPosition.project(camera);

            planet.element.style.left = ((worldPosition.x * 0.5 + 0.5) * width) + 'px';
            planet.element.style.top = ((-worldPosition.y * 0.5 + 0.5) * height) + 'px';
            planet.element.style.display = worldPosition.z > 1 ? 'none' : '';

            const depthFactor = Math.max(0.3, Math.min(1, 1 - ((planet.anchor.position.z - camera.position.z + 15) / 30)));
            planet.element.style.opacity = depthFactor;
            planet.element.style.transform = `translate(-50%,-50%) scale(${0.7 + depthFactor * 0.4})`;
        });

        renderer.render(scene, camera);
    };

    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalaxy, {once: true});
} else {
    initGalaxy();
}
