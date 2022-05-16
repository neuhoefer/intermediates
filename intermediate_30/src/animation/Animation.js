import * as THREE from 'three';

export const AnimationType = {
  TRANSLATION: 0,
  ROTATION: 1
};

export const AnimationAxis = {
  X: 0,
  Y: 1,
  Z: 2
};

export class Animation {

  constructor(target, type, axis) {

    this.target = target;
    this.type = type;
    this.axis = axis;
    this.amount = 0;
    this.speed = 0;
    this.initialPositionIsEndPosition = true;   // true so that the object will initially not move

    this.initialPosition = target.position.clone();
    this.initialRotation = (new THREE.Vector3()).setFromEuler(target.rotation);

    this.completed = true;
    this.onCompleteCallback = null;
  }

  setAmount(amount) {
    this.amount = amount;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  toggleEndPosition() {
    this.initialPositionIsEndPosition = !this.initialPositionIsEndPosition;
  }

  update(delta) {

    let endPositionValue = 0;

    // Assume the initial position/rotation to be the end position/rotation
    switch (this.type) {
      case AnimationType.TRANSLATION:
        endPositionValue = this.initialPosition.getComponent(this.axis);
        break;
      case AnimationType.ROTATION:
        endPositionValue = this.initialRotation.getComponent(this.axis);
        break;
    }

    // If the initial position/rotation is NOT the end position/rotation, add the animation amount
    if (!this.initialPositionIsEndPosition) {
      endPositionValue += this.amount;
    }

    // Move as required
    switch (this.type) {

      case AnimationType.TRANSLATION:

        let newTranslation = 0;

        if (Math.abs(this.target.position.getComponent(this.axis) - endPositionValue) < 0.05) {

          // If the current position is less than 0.01 units away from the end position, set it finally
          this.target.position.setComponent(this.axis, endPositionValue);

          // Call oncomplete callback function
          if (this.onCompleteCallback !== null && !this.completed) {
            this.onCompleteCallback();
            this.completed = true;
          }

        } else {

          // Else increase or decrease the current position by (speed * delta)
          if (this.target.position.getComponent(this.axis) < endPositionValue) {
            newTranslation = this.target.position.getComponent(this.axis) + this.speed * delta;
          } else {
            newTranslation = this.target.position.getComponent(this.axis) - this.speed * delta;
          }
          this.target.position.setComponent(this.axis, newTranslation);

          // Set completion flag
          this.completed = false;
        }
        break;

      case AnimationType.ROTATION:

        let newRotation = this.initialRotation.clone();

        if (Math.abs((new THREE.Vector3()).setFromEuler(this.target.rotation).getComponent(this.axis) - endPositionValue) < 0.05) {

          // If the current rotation is less than 0.01 radians away from the end rotation, set it finally
          newRotation.setComponent(this.axis, endPositionValue);
          this.target.rotation.setFromVector3(newRotation);

          // Call oncomplete callback function and set completion flag
          if (this.onCompleteCallback !== null && !this.completed) {
            this.onCompleteCallback();
            this.completed = true;
          }

        } else {

          // Else increase or decrease the current rotation by (speed * delta)
          if ((new THREE.Vector3()).setFromEuler(this.target.rotation).getComponent(this.axis) < endPositionValue) {
            newRotation.setComponent(this.axis, (new THREE.Vector3()).setFromEuler(this.target.rotation).getComponent(this.axis) + this.speed * delta);
          } else {
            newRotation.setComponent(this.axis, (new THREE.Vector3()).setFromEuler(this.target.rotation).getComponent(this.axis) - this.speed * delta);
          }
          this.target.rotation.setFromVector3(newRotation);

          // Set completion flag
          this.completed = false;
        }
        break;
    }
  }

  onComplete(callback) {
    this.onCompleteCallback = callback;
  }
}