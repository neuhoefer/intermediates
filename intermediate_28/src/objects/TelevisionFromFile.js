import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class TelevisionFromFile extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
    this.load(this);
  }

  load(thisTelevision) {

    this.gltfLoader.load('src/models/television.gltf', function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          console.log(child.name);
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
      thisTelevision.add(gltf.scene);
    });
  }
}
