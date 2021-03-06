import { getForward, getLeft, getRight } from './direction-util';
import { Direction } from './shared';

export class Road {
  directionalBias: number; // between 0 and 1
  forkChance: number; // between 0 and 1
  lastDirectionChangeAtLength;
  minStraightLength;

  done: boolean;

  constructor(
    public x: number,
    public y: number,
    public bias: Direction,
    public managerRef: any,
    public length: number = 0,
    public forkNumber: number = 0
  ) {
    this.lastDirectionChangeAtLength = this.length;
    this.directionalBias = 0.8;
    this.forkChance = 0.6;
    this.minStraightLength = 3;
  }

  build() {
    let forked = null;

    // Has this road reached its last tick?
    this.length++;
    if (this.length >= 20) {
      this.done = true;
      return;
    }

    // Calculate what direction the road will build in
    // Will the road continue to build in its biased direction?
    const mustGoStraight =
      this.length <= this.lastDirectionChangeAtLength + this.minStraightLength;
    const continueInBiasedDir =
      mustGoStraight || Math.random() < this.directionalBias;

    if (continueInBiasedDir) {
      const { x, y } = getForward(this.x, this.y, this.bias);
      const canMoveForward = !this.managerRef.tileExists(
        this.x,
        this.y,
        this.bias
      );
      if (!canMoveForward) {
        return;
      } else {
        this.x = x;
        this.y = y;
      }
    } else {
      this.lastDirectionChangeAtLength = this.length;

      // Can I move to the left/right?
      const left = getLeft(this.x, this.y, this.bias);
      const right = getRight(this.x, this.y, this.bias);
      const canMoveLeft = !this.managerRef.tileExists(
        left.x,
        left.y,
        this.bias
      );
      const canMoveRight = !this.managerRef.tileExists(
        right.x,
        right.y,
        this.bias
      );

      // Should we move to the left or the right?
      const moveToLeft = Math.random() > 0.5;
      if (moveToLeft && canMoveLeft) {
        forked = this.generateFork();
        const { x, y, bias } = getLeft(this.x, this.y, this.bias);
        this.x = x;
        this.y = y;
        this.bias = bias;
      } else if (!moveToLeft && canMoveRight) {
        forked = this.generateFork();
        const { x, y, bias } = getRight(this.x, this.y, this.bias);
        this.x = x;
        this.y = y;
        this.bias = bias;
      } else {
        return;
      }
    }

    // Return the value
    return {
      x: this.x,
      y: this.y,
      forked
    };
  }

  generateFork() {
    // Should we fork?
    const shouldFork = Math.random() < this.forkChance;
    if (shouldFork) {
      // Should the fork add more length than its parent
      // This prevents the diamond shape and adds more natural overall shape
      const additionalLength = Math.ceil(
        Math.random() * this.minStraightLength
      );
      const forkLength = this.length - additionalLength;
      return new Road(
        this.x,
        this.y,
        this.bias,
        this.managerRef,
        forkLength,
        this.forkNumber + 1
      );
    }
  }
}
