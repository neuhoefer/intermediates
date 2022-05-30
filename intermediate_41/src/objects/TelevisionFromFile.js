import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class TelevisionFromFile extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
    this.loadingDone = false;
    this.animationMixer = null;
    this.animations = new Map();
    this.blackTexture = null;
    this.noiseTexture = null;
    this.movieTexture = null;
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
        if (child.name === 'screenGLTF') {
          const videoPlaneMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
          thisTelevision.blackTexture = new THREE.TextureLoader().load('src/images/black.png');
          document.televisionFromFile_noise = document.createElement('video');
          document.televisionFromFile_noise.src = 'src/videos/noise.mp4';
          document.televisionFromFile_noise.loop = true;
          thisTelevision.noiseTexture = new THREE.VideoTexture(document.televisionFromFile_noise);
          document.televisionFromFile_movie = document.createElement('video');
          document.televisionFromFile_movie.src = 'src/videos/movie.mp4';
          document.televisionFromFile_movie.loop = true;
          thisTelevision.movieTexture = new THREE.VideoTexture(document.televisionFromFile_movie);
          videoPlaneMaterial.map = thisTelevision.blackTexture;

          const videoPlaneGeometry = new THREE.PlaneGeometry(26, 22);
          thisTelevision.videoPlane = new THREE.Mesh(videoPlaneGeometry, videoPlaneMaterial);
          thisTelevision.videoPlane.position.set(0, 0, 0.12);
          thisTelevision.videoPlane.scale.set(0.06, 0.06, 0.06);
          thisTelevision.videoPlane.name = 'videoPlane';
          child.add(thisTelevision.videoPlane);

          child.material.format = THREE.RGBAFormat;
          child.material.transparent = true;
          child.material.opacity = 0.4;
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
      thisTelevision.animationMixer.addEventListener('finished', thisTelevision.updateFunctionalState.bind(thisTelevision));
    });
  }

  updateFunctionalState() {

    let videoPlane = null;
    this.traverse(function (child) {
      if (child.name === 'videoPlane') {
        videoPlane = child;
      }
    });

    if (this.state.powerOn) {
      if (this.state.antennaUp) {
        document.televisionFromFile_noise.pause();
        document.televisionFromFile_movie.play();
        videoPlane.material.map = this.movieTexture;
        if (this.state.volumeHigh) {
          document.televisionFromFile_movie.volume = 1.0;
        } else {
          document.televisionFromFile_movie.volume = 0.5;
        }
      } else {
        document.televisionFromFile_movie.pause();
        document.televisionFromFile_noise.play();
        videoPlane.material.map = this.noiseTexture;
        if (this.state.volumeHigh) {
          document.televisionFromFile_noise.volume = 1.0;
        } else {
          document.televisionFromFile_noise.volume = 0.5;
        }
      }
    } else {
      document.televisionFromFile_noise.pause();
      document.televisionFromFile_movie.pause();
      videoPlane.material.map = this.blackTexture;
    }
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
