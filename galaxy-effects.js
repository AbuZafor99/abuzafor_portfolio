import * as THREE from 'three';

export function createGlowTexture(size, centerColor, edgeColor) {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = size;
    textureCanvas.height = size;

    const context = textureCanvas.getContext('2d');
    const half = size / 2;
    const gradient = context.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, centerColor);
    gradient.addColorStop(0.2, edgeColor);
    gradient.addColorStop(0.6, 'rgba(0,0,0,0.03)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(textureCanvas);
}

export function createOrbitalPath(scene, radius, color) {
    const points = [];

    for (let index = 0; index <= 128; index += 1) {
        const angle = (index / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }

    scene.add(
        new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({color, transparent: true, opacity: 0.15})
        )
    );
}

export function createStarField(scene, density = 300) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(density * 3);

    for (let index = 0; index < density; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 60;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[index * 3 + 2] = -5 - Math.random() * 35;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starTexture = createGlowTexture(32, 'rgba(255,255,255,1)', 'rgba(200,220,255,0.3)');
    scene.add(
        new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
                map: starTexture,
                size: 0.25,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            })
        )
    );
}

export function createCoreGlow(scene) {
    const glowTexture = createGlowTexture(256, 'rgba(255,255,255,0.9)', 'rgba(0,229,160,0.35)');

    const primaryGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0x00e5a0,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    primaryGlow.scale.set(3, 3, 1);
    scene.add(primaryGlow);

    const secondaryGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0x00e5a0,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    secondaryGlow.scale.set(5, 5, 1);
    scene.add(secondaryGlow);

    return {primaryGlow, secondaryGlow};
}