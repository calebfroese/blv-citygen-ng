import { getForward, getLeft, getRight } from './direction-util';
import { Direction } from './shared';

export class Road {
  directionalBias: number; // between 0 and 1
  forkChance: number; // between 0 and 1
  lastDirectionChangeAtLength;

  done: boolean;

  constructor(
    public x: number,
    public y: number,
    public bias: Direction,
    public length: number = 0
  ) {
    this.lastDirectionChangeAtLength = this.length;
    this.directionalBias = 0.7;
    this.forkChance = 0.3;
  }

  build() {
    let forked = null;

    // Calculate what direction the road will build in
    // Will the road continue to build in its biased direction?
    const mustGoStraight = this.length <= this.lastDirectionChangeAtLength + 4;
    const continueInBiasedDir =
      mustGoStraight || Math.random() < this.directionalBias;

    if (continueInBiasedDir) {
      const { x, y } = getForward(this.x, this.y, this.bias);
      this.x = x;
      this.y = y;
    } else {
      this.lastDirectionChangeAtLength = this.length;
      // Should we fork?
      const shouldFork = Math.random() < this.forkChance;
      if (shouldFork) {
        forked = new Road(this.x, this.y, this.bias, this.length);
      }

      // Should we move to the left or the right?
      const moveToLeft = Math.random() > 0.5;
      if (moveToLeft) {
        const { x, y, bias } = getLeft(this.x, this.y, this.bias);
        this.x = x;
        this.y = y;
        this.bias = bias;
      } else {
        const { x, y, bias } = getRight(this.x, this.y, this.bias);
        this.x = x;
        this.y = y;
        this.bias = bias;
      }
    }

    // Has this road reached its last tick?
    this.length++;
    if (this.length >= 20) {
      this.done = true;
    }

    // Return the value
    return {
      x: this.x,
      y: this.y,
      forked
    };
  }
}
