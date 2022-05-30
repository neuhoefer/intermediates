import * as CANNON from '../../../../lib/cannon-es-0.19.0/dist/cannon-es.js';
import CannonDebugger from '../../../../lib/cannon-es-debugger-0.1.4/dist/cannon-es-debugger.js';

export default class Physics {

  constructor(debugRendering = false) {

    this.world = new CANNON.World();

    this.stepSize = 0;
    this.timeToGo = 0;
    this.objects = [];
    this.bodies = [];

    if (debugRendering) {
      this.debugger = new CannonDebugger(window.scene, this.world.bodies);
    }
  }

  setup(gravityX, gravityY, gravityZ, stepSize, addFloor) {

    this.world.gravity.set(gravityX, gravityY, gravityZ);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.stepSize = stepSize;

    if (addFloor) {
      let floor = new CANNON.Body({
        shape: new CANNON.Plane(),
        mass: 0
      });
      floor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      this.world.addBody(floor);
    }
  }

  addPair(object, body) {

    this.objects.push(object);
    this.bodies.push(body);
  }

  update(delta) {

    // Step physics world forward
    this.timeToGo += delta;
    while (this.timeToGo >= this.stepSize) {
      this.world.step(this.stepSize);
      this.timeToGo -= this.stepSize;
    }
    // Copy transformations
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].position.copy(this.bodies[i].position);
      this.objects[i].quaternion.copy(this.bodies[i].quaternion);
    }
  }

  getWorld() {
    return this.world;
  }

  addBox(object, mass, dimX, dimY, dimZ, offsetX = 0, offsetY = 0, offsetZ = 0, sleeping = false) {

    // Create body with specified mass
    const body = new CANNON.Body({mass: mass});

    // Add shape (~collider) to physical body
    const dimension = new CANNON.Vec3(dimX / 2, dimY / 2, dimZ / 2);
    const offset = new CANNON.Vec3(offsetX, offsetY, offsetZ);
    body.addShape(new CANNON.Box(dimension), offset);

    // Copy initial transformation from visual object
    body.position.copy(object.position);
    body.quaternion.copy(object.quaternion);

    // Set body to sleep if required
    if (sleeping) {
      body.sleep();
    }

    // Add body to physical world
    this.world.addBody(body);

    // Register object-body-pair
    this.addPair(object, body);
  }

  addCylinder(object, mass, upperRadius, lowerRadius, height, segments,
              offsetX = 0, offsetY = 0, offsetZ = 0,
              eulerX = 0, eulerY = 0, eulerZ = 0,
              sleeping = false) {

    // Create body with specified mass
    const body = new CANNON.Body({mass: mass});

    const offset = new CANNON.Vec3(offsetX, offsetY, offsetZ);
    const rotation = new CANNON.Quaternion().setFromEuler(eulerX, eulerY, eulerZ, "XYZ");
    body.addShape(new CANNON.Cylinder(upperRadius, lowerRadius, height, segments), offset, rotation);

    // Copy initial transformation from visual object
    body.position.copy(object.position);
    body.quaternion.copy(object.quaternion);

    // Set body to sleep if required
    if (sleeping) {
      body.sleep();
    }

    // Add body to physical world
    this.world.addBody(body);

    // Register object-body-pair
    this.addPair(object, body);
  }

  addConvexPolyhedron(object, mass, vertices, faces, sleeping = false) {

    // Create body with specified mass
    const body = new CANNON.Body({mass: mass});

    // Add shape (~collider) to physical body
    const cannonVertices = [];
    vertices.forEach(function (position) {
      cannonVertices.push(new CANNON.Vec3(position[0], position[1], position[2]));
    });
    body.addShape(new CANNON.ConvexPolyhedron({vertices: cannonVertices, faces: faces}));

    // Copy initial transformation from visual object
    body.position.copy(object.position);
    body.quaternion.copy(object.quaternion);

    // Set body to sleep if required
    if (sleeping) {
      body.sleep();
    }

    // Add body to physical world
    this.world.addBody(body);

    // Register object-body-pair
    this.addPair(object, body);
  }

  addSphereWithVelocity(object, mass, radius, velocityVector) {

    // Create body with specified mass
    const body = new CANNON.Body({mass: mass});

    // Add shape (~collider) to physical body
    body.addShape(new CANNON.Sphere(radius));

    // Copy initial transformation from visual object
    body.position.copy(object.position);
    body.quaternion.copy(object.quaternion);

    // Set velocity to body
    body.velocity.set(velocityVector.x, velocityVector.y, velocityVector.z);

    // Add body to physical world
    this.world.addBody(body);

    // Register object-body-pair
    this.addPair(object, body);
  }
}