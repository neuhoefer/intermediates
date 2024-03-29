import * as THREE from 'three';
import * as DATGUI from 'datgui';
import * as CONTROLS from 'controls';

// Event functions
import {updateAspectRatio} from './eventfunctions/updateAspectRatio.js';

function main() {

  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(20));

  window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  window.camera.position.set(30, 40, 50);

  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0xffffff);
  window.renderer.shadowMap.enabled = true;

  document.getElementById('3d_content').appendChild(window.renderer.domElement);

  let cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
  let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: false});
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-5, 3, 5);
  cube.castShadow = true;
  //window.scene.add(cube);

  let sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
  let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: false});
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(10, 5, -5);
  sphere.castShadow = true;
  //window.scene.add(sphere);

  let cubeSphereGroup = new THREE.Group();
  cubeSphereGroup.add(cube);
  cubeSphereGroup.add(sphere);
  window.scene.add(cubeSphereGroup);

  let planeGeometry = new THREE.PlaneGeometry(40, 40);
  let planeMaterial = new THREE.MeshLambertMaterial({color: 0xAAAAAA, wireframe: false});
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
  plane.receiveShadow = true;
  window.scene.add(plane);

  let ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.5;
  window.scene.add(ambientLight);

  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(15, 20, 20);
  spotLight.intensity = 0.8;
  spotLight.target = plane;
  spotLight.angle = THREE.MathUtils.degToRad(30);
  spotLight.penumbra = 1.0;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(1024, 1024);
  spotLight.shadow.camera.aspect = 1;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 40;
  window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  window.scene.add(spotLight);

  let gui = new DATGUI.GUI();
  gui.add(spotLight.position, 'x', -50, 50);
  gui.add(spotLight.position, 'y', -50, 50);
  gui.add(spotLight.position, 'z', -50, 50);
  let proxy = {xyz_group: 0};
  gui.add(proxy, 'xyz_group', -50, 50).onChange(function (e) {
    cubeSphereGroup.position.set(e, e, e);
  });

  let orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
  orbitControls.target = new THREE.Vector3(0, 0, 0);
  orbitControls.update();

  function mainLoop() {

    window.renderer.render(window.scene, window.camera);

    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

window.onload = main;
window.onresize = updateAspectRatio;