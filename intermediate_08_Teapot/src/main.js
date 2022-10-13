import * as THREE from 'three';
import * as DATGUI from 'datgui';
import {TeapotGeometry} from '../../../lib/three.js-r145/examples/jsm/geometries/TeapotGeometry.js';

function main() {

  window.scene = new THREE.Scene();
  //window.scene.add(new THREE.AxesHelper(20));

  window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  window.camera.position.set(30, 40, 50);
  window.camera.lookAt(0, 0, 0);

  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0xffffff);
  window.renderer.shadowMap.enabled = true;

  document.getElementById('3d_content').appendChild(window.renderer.domElement);

  let teapotGeometry = new TeapotGeometry(10, 10);
  let teapotMaterial = new THREE.MeshLambertMaterial({color: 0x000000, wireframe: true});
  let teapot = new THREE.Mesh(teapotGeometry, teapotMaterial);
  teapot.rotation.set(0, THREE.MathUtils.degToRad(220), 0);
  teapot.position.set(2, 2, 2);
  teapot.scale.set(0.8, 0.8, 0.8);
  teapot.castShadow = true;
  window.scene.add(teapot);

  let ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.5;
  window.scene.add(ambientLight);

  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(15, 20, 20);
  spotLight.intensity = 0.8;
  spotLight.target = teapot;
  spotLight.angle = THREE.MathUtils.degToRad(30);
  spotLight.penumbra = 1.0;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(1024, 1024);
  spotLight.shadow.camera.aspect = 1;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 40;
  //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  window.scene.add(spotLight);

  let gui = new DATGUI.GUI();
  gui.add(spotLight.position, 'x', -50, 50);
  gui.add(spotLight.position, 'y', -50, 50);
  gui.add(spotLight.position, 'z', -50, 50);

  function mainLoop() {

    window.renderer.render(window.scene, window.camera);

    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

window.onload = main;