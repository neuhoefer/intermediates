import * as THREE from 'three';
import * as DATGUI from 'datgui';

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
  let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: false});
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-5, 3, 5);
  window.scene.add(cube);

  let sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
  let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: false});
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(10, 5, -5);
  window.scene.add(sphere);

  let planeGeometry = new THREE.PlaneGeometry(40, 40);
  let planeMaterial = new THREE.MeshLambertMaterial({color: 0xAAAAAA, wireframe: false});
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
  window.scene.add(plane);

  let ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.5;
  window.scene.add(ambientLight);

  let gui = new DATGUI.GUI();
  gui.add(sphere.position, 'x', -50, 50).step(5);
  gui.add(sphere.position, 'y', -50, 50).onChange(function (e) {
    cube.position.y = e;
  });
  let proxy = {z_pos: 0};
  gui.add(proxy, 'z_pos', -50, 50).onChange(function (e) {
    sphere.position.z = cube.position.z = e;
  });

  function mainLoop() {

    window.renderer.render(window.scene, window.camera);

    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

window.onload = main;