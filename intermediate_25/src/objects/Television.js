import * as THREE from 'three';
import * as TWEEN from 'tween';
import CSG from 'csg';

import {Animation, AnimationType, AnimationAxis} from '../animation/Animation.js';

export default class Television extends THREE.Group {

  constructor() {
    super();

    this.animations = [];
    this.addParts();
  }

  addParts() {

    const corpusMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4000,
      flatShading: true,
      specular: 0x111111,
      shininess: 100
    });
    const ventilationMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4000,
      flatShading: true,
      specular: 0x111111,
      shininess: 100,
      bumpMap: new THREE.TextureLoader().load('src/images/corpusVentilation.png'),
      bumpScale: 1.0
    });
    const frontMaterial = new THREE.MeshPhongMaterial({
      color: 0x111111,
      flatShading: true,
      bumpMap: new THREE.TextureLoader().load('src/images/frontFrame.png'),
      bumpScale: 1.0
    });
    const screenMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      transparent: true,
      opacity: 0.2
    });
    const panelMaterial = new THREE.MeshPhongMaterial({color: 0x191919, flatShading: true});
    const panelMaterialTextured = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      map: new THREE.TextureLoader().load('src/images/panelTexture.png')
    });
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xe7e7e7,
      flatShading: false,
      roughness: 0.0,
      metalness: 0.3
    });
    const envMap = new THREE.TextureLoader()
        .load('../../lib/three.js-r139/examples/textures/2294472375_24a3b8ef46_o.jpg');
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    envMap.encoding = THREE.sRGBEncoding;
    metalMaterial.envMap = envMap;
    metalMaterial.envMapIntensity = 10.0;


    // Corpus
    // ------
    const positions = [
      25.0, 18.2, 16.5,     // 0
      -25.0, 18.2, 16.5,    // 1
      -25.0, -14.7, 16.5,   // 2
      25.0, -14.7, 16.5,    // 3
      16.8, 11.0, -18.0,    // 4
      -16.8, 11.0, -18.0,   // 5
      -16.8, -13.0, -18.0,  // 6
      16.8, -13.0, -18.0,   // 7
      17.5, -14.6, 14.0,    // 8
      -17.5, -14.6, 14.0,   // 9
      -17.5, -16.8, 14.0,   // 10
      17.5, -16.8, 14.0,    // 11
      14.8, -13.85, -2.0,   // 12
      -14.8, -13.85, -2.0,  // 13
      -14.8, -16.8, -2.0,   // 14
      14.8, -16.8, -2.0     // 15
    ];

    const indices = [
      0, 1, 2,    // body front 1/2
      0, 2, 3,    // body front 2/2
      1, 5, 6,    // body left 1/2
      1, 6, 2,    // body left 2/2
      4, 0, 3,    // body right 1/2
      4, 3, 7,    // body right 2/2
      4, 5, 1,    // body top 1/2
      4, 1, 0,    // body top 2/2
      3, 2, 6,    // body bottom 1/2
      3, 6, 7,    // body bottom 2/2
      5, 4, 7,    // body back 1/2
      5, 7, 6,    // body back 2/2
      8, 9, 10,   // foot front 1/2
      8, 10, 11,  // foot front 2/2
      9, 13, 14,  // foot left 1/2
      9, 14, 10,  // foot left 2/2
      12, 8, 11,  // foot right 1/2
      12, 11, 15, // foot right 2/2
      11, 10, 14, // foot bottom 1/2
      11, 14, 15, // foot bottom 2/2
      13, 12, 15, // foot back 1/2
      13, 15, 14  // foot back 2/2
    ];

    const corpusGeometry = new THREE.BufferGeometry();
    corpusGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    corpusGeometry.setIndex(indices);
    corpusGeometry.computeVertexNormals();
    const corpus = new THREE.Mesh(corpusGeometry, corpusMaterial);
    //corpus.castShadow = true;
    //this.add(corpus);

    const cavityGeometry = new THREE.BufferGeometry();
    cavityGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    cavityGeometry.setIndex(indices.slice(0, 36));
    cavityGeometry.computeVertexNormals();
    cavityGeometry.translate(0, 0.4, 4);
    cavityGeometry.scale(1, 0.98, 1);
    const cavity = new THREE.Mesh(cavityGeometry, corpusMaterial);

    const corpusCSG = CSG.fromMesh(corpus);
    const cavityCSG = CSG.fromMesh(cavity);
    const hollowCorpus = CSG.toMesh(corpusCSG.subtract(cavityCSG), corpus.matrix, corpus.material);
    hollowCorpus.castShadow = true;
    this.add(hollowCorpus);

    // Ventilation
    // -----------
    const ventilationGeometry = new THREE.PlaneGeometry(33, 24);
    const ventilation = new THREE.Mesh(ventilationGeometry, ventilationMaterial);
    ventilation.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
    ventilation.position.set(0, -1, -18.1);
    hollowCorpus.add(ventilation);

    // Front
    // -----
    const frontGeometry = new THREE.PlaneGeometry(48, 32);
    const front = new THREE.Mesh(frontGeometry, frontMaterial);
    front.position.set(0, 1.5, 15.5);
    this.add(front);

    // Screen
    // ------
    const screenGeometry = new THREE.BoxGeometry(26, 22, 1);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(-5.7, 2, 15.5);
    this.add(screen);

    // Panel
    // -----
    const panelGeometry = new THREE.BoxGeometry(8, 22, 1);
    const panel = new THREE.Mesh(panelGeometry,
        [panelMaterial, panelMaterial, panelMaterial, panelMaterial, panelMaterialTextured, panelMaterial]);
    panel.position.set(17.5, 2, 15.5);
    this.add(panel);

    // Power Knob
    // ----------
    const knobGeometry = new THREE.CylinderGeometry(1.8, 1.8, 1, 32);
    const knobGripGeometry = new THREE.BoxGeometry(0.4, 1, 3).translate(0, 1, 0);
    const powerKnob = new THREE.Mesh(knobGeometry, metalMaterial).add(new THREE.Mesh(knobGripGeometry, metalMaterial));
    powerKnob.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
    powerKnob.position.set(0, 7.8, 0.5);
    powerKnob.name = 'powerKnob';
    powerKnob.children[0].name = 'powerKnob';
    panel.add(powerKnob);

    // Power Knob Animation
    // --------------------
    const powerKnobAnimation = new Animation(powerKnob, AnimationType.ROTATION, AnimationAxis.Y);
    powerKnobAnimation.setAmount(THREE.MathUtils.degToRad(-90));
    powerKnobAnimation.setSpeed(THREE.MathUtils.degToRad(360));
    powerKnob.linearAnimation = powerKnobAnimation;
    this.animations.push(powerKnobAnimation);

    // Volume Knob
    // -----------
    const volumeKnob = powerKnob.clone();
    volumeKnob.position.set(0, 3, 0.5);
    volumeKnob.name = 'volumeKnob';
    volumeKnob.children[0].name = 'volumeKnob';
    panel.add(volumeKnob);

    // Volume Knob Animation
    // --------------------
    const volumeKnobAnimation = new Animation(volumeKnob, AnimationType.ROTATION, AnimationAxis.Y);
    volumeKnobAnimation.setAmount(THREE.MathUtils.degToRad(-90));
    volumeKnobAnimation.setSpeed(THREE.MathUtils.degToRad(360));
    volumeKnob.linearAnimation = volumeKnobAnimation;
    this.animations.push(volumeKnobAnimation);

    // Antenna Foot
    // ------------
    const antennaFootGeometry = new THREE.CylinderGeometry(1, 1, 5, 16);
    const antennaFoot = new THREE.Mesh(antennaFootGeometry, metalMaterial);
    antennaFoot.position.set(0, 14, -6.5);
    antennaFoot.rotation.set(0, 0, THREE.MathUtils.degToRad(90));
    this.add(antennaFoot);

    // Antenna
    // -------
    const antennaProfile = new THREE.Shape().absellipse(0, 0, 0.2, 0.2,
        0, THREE.MathUtils.degToRad(360));
    const antennaSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(-1, 3, 0),
      new THREE.Vector3(-15, 3, 0),
      new THREE.Vector3(-15, 17, 0),
      new THREE.Vector3(15, 17, 0),
      new THREE.Vector3(15, 3, 0),
      new THREE.Vector3(1, 3, 0),
      new THREE.Vector3(1, 0, 0)
    ]);
    antennaSpline.curveType = 'catmullrom';
    antennaSpline.tension = 0.0;
    const extrudeSettings = {
      steps: 200,
      curveSegments: 100,
      extrudePath: antennaSpline
    };
    const antennaGeometry = new THREE.ExtrudeGeometry(antennaProfile, extrudeSettings);
    const antenna = new THREE.Mesh(antennaGeometry, metalMaterial);
    antenna.position.set(0, 14.7, -6.5);
    antenna.rotation.set(THREE.MathUtils.degToRad(80), 0, 0);
    antenna.castShadow = true;
    antenna.name = 'antenna';
    this.add(antenna);

    // Antenna Animation
    // -----------------
    antenna.tweenAnimationUp = new TWEEN.Tween(antenna.rotation).to(new THREE.Vector3(
            antenna.rotation.x - THREE.MathUtils.degToRad(80),
            antenna.rotation.y,
            antenna.rotation.z),
        2000).easing(TWEEN.Easing.Quadratic.Out);
    antenna.tweenAnimationDown = new TWEEN.Tween(antenna.rotation).to(new THREE.Vector3(
            antenna.rotation.x,
            antenna.rotation.y,
            antenna.rotation.z),
        2000).easing(TWEEN.Easing.Quadratic.Out);
    antenna.up = false;
  }
}