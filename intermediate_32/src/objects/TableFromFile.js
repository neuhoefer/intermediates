import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class TableFromFile extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
    this.load(this);
  }

  load(thisTable) {

    this.gltfLoader.load('src/models/table.gltf', function (gltf) {

      gltf.scene.traverse(function (child) {

        if (child.name === 'surface' || child.name === 'legs') {
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
      thisTable.add(gltf.scene);
    });
  }
}