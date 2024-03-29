import * as THREE from 'three';
import * as DATGUI from 'datgui';
import * as CONTROLS from 'controls';
import * as TWEEN from 'tween';

// Own modules
import Television from './objects/Television.js';
import TelevisionFromFile from './objects/TelevisionFromFile.js';
import TableFromFile from './objects/TableFromFile.js';
import Floor from './objects/Floor.js';
import Physics from './physics/Physics.js';

// Event functions
import {updateAspectRatio} from './eventfunctions/updateAspectRatio.js';
import {executeRaycast} from './eventfunctions/executeRaycast.js';

function main() {

  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(50));

  window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  window.camera.position.set(-100, 200, 200);

  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0xffffff);
  window.renderer.shadowMap.enabled = true;

  window.physics = new Physics(true);
  window.physics.setup(0, -200, 0, 1 / 120, true);

  document.getElementById('3d_content').appendChild(window.renderer.domElement);

  const television = new Television();
  television.position.set(-30, 55.8, 0);
  television.rotation.set(0, THREE.MathUtils.degToRad(10), 0);
  window.scene.add(television);

  const televisionFromFile = new TelevisionFromFile();
  televisionFromFile.position.set(30, 55.8, 0);
  televisionFromFile.rotation.set(0, THREE.MathUtils.degToRad(-10), 0);
  window.scene.add(televisionFromFile);

  const tableFromFile = new TableFromFile();
  tableFromFile.position.set(0, 0, 0);
  tableFromFile.addPhysics();
  window.scene.add(tableFromFile);

  const floor = new Floor();
  floor.position.set(0, 0, 0);
  window.scene.add(floor);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.5;
  window.scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 200, 200);
  spotLight.intensity = 0.8;
  spotLight.target = floor;
  spotLight.angle = THREE.MathUtils.degToRad(30);
  spotLight.penumbra = 1.0;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(2048, 2048);
  spotLight.shadow.camera.aspect = 1;
  spotLight.shadow.camera.near = 100;
  spotLight.shadow.camera.far = 500;
  spotLight.shadow.bias = -0.001;
  //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  window.scene.add(spotLight);

  const gui = new DATGUI.GUI();
  gui.add(spotLight.position, 'x', 0, 200);
  gui.add(spotLight.position, 'y', 0, 200);
  gui.add(spotLight.position, 'z', 0, 200);

  const orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
  orbitControls.target = new THREE.Vector3(0, 0, 0);
  orbitControls.update();

  const clock = new THREE.Clock();

  function mainLoop() {

    const delta = clock.getDelta();

    television.animations.forEach(function (animation) {
      animation.update(delta);
    });

    TWEEN.update();

    if (televisionFromFile.animationMixer !== null) {
      televisionFromFile.animationMixer.update(delta);
    }

    window.physics.update(delta);

    window.renderer.render(window.scene, window.camera);
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

window.onload = main;
window.onresize = updateAspectRatio;
window.onclick = executeRaycast;