import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class PlantFromFile extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
    this.loadingDone = false;
    this.load(this);
  }

  load(thisPlant) {

    this.gltfLoader.load('src/models/plant.gltf', function (gltf) {

      gltf.scene.traverse(function (child) {

        if (child.isMesh) {
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
      gltf.scene.position.set(0, -75, 0); // Shift plant down half its size
      thisPlant.add(gltf.scene);
      thisPlant.loadingDone = true;
    });
  }

  addPhysics() {
    if (this.loadingDone === false) {
      window.setTimeout(this.addPhysics.bind(this), 100);
    } else {
      window.physics.addCylinder(this, 5, 20, 10, 150, 12);
    }
  }

  addSound() {
    const sound = new THREE.PositionalAudio(window.audioListener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('src/sounds/wood.wav', function (buffer) {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
      sound.setVolume(0.5);
      sound.setLoop(true);
      sound.play();
    });
    this.add(sound);
  }
}