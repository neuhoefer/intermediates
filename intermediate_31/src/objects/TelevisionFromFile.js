import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class TelevisionFromFile extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
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
    });
  }
}
