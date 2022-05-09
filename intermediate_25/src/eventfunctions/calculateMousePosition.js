import * as THREE from 'three';

window.mousePosition = new THREE.Vector2();

export function calculateMousePosition(event) {

  window.mousePosition.x = 2 * (event.clientX / window.innerWidth) - 1;
  window.mousePosition.y = -2 * (event.clientY / window.innerHeight) + 1;

  //console.log(window.mousePosition.x + "\t" + window.mousePosition.x);
}