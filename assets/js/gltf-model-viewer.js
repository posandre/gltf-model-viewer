function changeScale(scaleFactor) {
    const modelEl = document.querySelector('.gltf-model-viewer__entity');

    let currentScale = modelEl.object3D.scale;

    currentScale.x *= scaleFactor;
    currentScale.y *= scaleFactor;
    currentScale.z *= scaleFactor;

    modelEl.object3D.scale.set(currentScale.x, currentScale.y, currentScale.z);
    modelEl.object3D.updateMatrixWorld();

    // Corrected camera position
    modelEl.object3D.position.x *= scaleFactor;
    modelEl.object3D.position.y *= scaleFactor;
    modelEl.object3D.position.z *= scaleFactor;

    modelEl.object3D.updateMatrixWorld();
}

function setTargetToCenter() {
    let scale;
    let box;
    let center;
    let size;

    const modelEl = document.querySelector('.gltf-model-viewer__entity');
    const cameraEl = document.querySelector('.gltf-model-viewer__camera');
    const gltfObject = modelEl.getObject3D('mesh');

    // Reset position and scales.
    modelEl.object3D.position.set(0, 0, 0);
    modelEl.object3D.scale.set(1.0, 1.0, 1.0);
    modelEl.object3D.updateMatrixWorld();

    // Calculate model size.
    box = new THREE.Box3().setFromObject(gltfObject);
    size = box.getSize(new THREE.Vector3());

    scale = 0.8 / size.y;

    scale = 1.0 / size.x < scale ? 1.0 / size.x : scale;

    scale = 1.0 / size.z < scale ? 1.0 / size.z : scale;

    modelEl.object3D.scale.set(scale, scale, scale);

    // Center model at (0, 0, 0).
    modelEl.object3D.updateMatrixWorld();

    box = new THREE.Box3().setFromObject(gltfObject);
    center = box.getCenter(new THREE.Vector3());
    size = box.getSize(new THREE.Vector3());

    modelEl.object3D.position.x = Math.abs(center.x);
    modelEl.object3D.position.y = Math.abs(center.y);
    modelEl.object3D.position.z = Math.abs(center.z);

    // When in mobile landscape we want to bring the model a bit closer.
    if (AFRAME.utils.device.isLandscape()) { cameraEl.object3D.position.z -= 1; }

    modelEl.object3D.updateMatrixWorld();
}

document.addEventListener('DOMContentLoaded', function() {
    const modelEl = document.querySelector('.gltf-model-viewer__entity');

    if (modelEl) {
        modelEl.addEventListener('model-loaded', setTargetToCenter);
    } else {
        console.error('Елемент з класом "gltf-model-viewer__entity" не знайдено.');
    }
});