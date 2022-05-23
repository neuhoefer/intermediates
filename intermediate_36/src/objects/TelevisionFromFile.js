import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class TelevisionFromFile extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
    this.loadingDone = false;
    this.animationMixer = null;
    this.animations = new Map();
    this.state = {
      powerOn: false,
      volumeHigh: false,
      antennaUp: false
    };
    this.load(this);
  }

  load(thisTelevision) {

    this.gltfLoader.load('src/models/television.gltf', function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.parentTelevision = thisTelevision;
        }
        if (child.name === 'antennaGLTF') {
          const envMap = new THREE.TextureLoader()
              .load('../../lib/three.js-r139/examples/textures/2294472375_24a3b8ef46_o.jpg');
          envMap.mapping = THREE.EquirectangularReflectionMapping;
          envMap.encoding = THREE.sRGBEncoding;
          child.material.envMap = envMap;
          child.material.envMapIntensity = 10.0;
        }
        if (child.name === 'corpusGLTF' || child.name === 'antennaGLTF') {
          child.castShadow = true;
        }
      });
      thisTelevision.animationMixer = new THREE.AnimationMixer(gltf.scene);
      for (let i = 0; i < gltf.animations.length; i++) {
        let action = thisTelevision.animationMixer.clipAction(gltf.animations[i]);
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopOnce);
        thisTelevision.animations.set(gltf.animations[i].name, action);
      }
      thisTelevision.add(gltf.scene);
      thisTelevision.loadingDone = true;
    });
  }

  addPhysics() {
    if (this.loadingDone === false) {
      window.setTimeout(this.addPhysics.bind(this), 100);
    } else {
      const positions = [
        [25.0, 18.2, 16.5],     // 0
        [-25.0, 18.2, 16.5],    // 1
        [-25.0, -16.8, 16.5],   // 2
        [25.0, -16.8, 16.5],    // 3
        [16.8, 11.0, -18.0],    // 4
        [-16.8, 11.0, -18.0],   // 5
        [-16.8, -16.8, -18.0],  // 6
        [16.8, -16.8, -18.0]    // 7
      ];
      const indices = [
        [0, 1, 2, 3],  // front
        [1, 5, 6, 2],  // left
        [4, 0, 3, 7],  // right
        [4, 5, 1, 0],  // top
        [3, 2, 6, 7],  // bottom
        [5, 4, 7, 6]   // back
      ];
      window.physics.addConvexPolyhedron(this, 3, positions, indices, true);
    }
  }
}
