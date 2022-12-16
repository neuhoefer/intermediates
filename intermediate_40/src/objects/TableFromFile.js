import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class TableFromFile extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
    this.loadingDone = false;
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
      thisTable.loadingDone = true;
    });
  }

  addPhysics() {
    if (this.loadingDone === false) {
      window.setTimeout(this.addPhysics.bind(this), 100);
    } else {
      window.physics.addBox(this, 10, 150, 39, 62, 0, 19.5, 0);
    }
  }
}