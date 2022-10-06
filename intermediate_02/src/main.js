import * as THREE from 'three';

function main() {

  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(20));

  window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  window.camera.position.set(30, 40, 50);
  window.camera.lookAt(0, 0, 0);

  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0xffffff);

  document.getElementById('3d_content').appendChild(window.renderer.domElement);

  let cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
  let cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-5, 3, 5);
  window.scene.add(cube);

  let sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
  let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(10, 5, -5);
  window.scene.add(sphere);

  let planeGeometry = new THREE.PlaneGeometry(40, 40);
  let planeMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA, wireframe: true});
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
  window.scene.add(plane);

  function mainLoop() {

    window.renderer.render(window.scene, window.camera);

    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

window.onload = main;