import { Injectable } from '@angular/core';
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

  getForward() {
    switch (this.bias) {
      case Direction.NORTH:
        return { x: this.x, y: this.y - 1 };
      case Direction.EAST:
        return { x: this.x + 1, y: this.y };
      case Direction.SOUTH:
        return { x: this.x, y: this.y + 1 };
      case Direction.WEST:
        return { x: this.x - 1, y: this.y };
    }
  }

  getLeft() {
    // make a left turn
    switch (this.bias) {
      case Direction.NORTH:
        return { x: this.x - 1, y: this.y, bias: Direction.WEST };
      case Direction.EAST:
        return { x: this.x, y: this.y - 1, bias: Direction.NORTH };
      case Direction.SOUTH:
        return { x: this.x + 1, y: this.y, bias: Direction.EAST };
      case Direction.WEST:
        return { x: this.x, y: this.y + 1, bias: Direction.SOUTH };
    }
  }

  getRight() {
    // make a right turn
    switch (this.bias) {
      case Direction.NORTH:
        return { x: this.x + 1, y: this.y, bias: Direction.EAST };
      case Direction.EAST:
        return { x: this.x, y: this.y + 1, bias: Direction.SOUTH };
      case Direction.SOUTH:
        return { x: this.x - 1, y: this.y, bias: Direction.WEST };
      case Direction.WEST:
        return { x: this.x, y: this.y - 1, bias: Direction.NORTH };
    }
  }

  build() {
    let forked = null;

    // Calculate what direction the road will build in
    // Will the road continue to build in its biased direction?
    const mustGoStraight = this.length <= this.lastDirectionChangeAtLength + 4;
    const continueInBiasedDir =
      mustGoStraight || Math.random() < this.directionalBias;

    if (continueInBiasedDir) {
      const { x, y } = this.getForward();
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
        const { x, y, bias } = this.getLeft();
        this.x = x;
        this.y = y;
        this.bias = bias;
      } else {
        const { x, y, bias } = this.getRight();
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
