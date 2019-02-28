import { Injectable } from '@angular/core';

export enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

export class Road {
  length = 0;
  biasStrength: number; // between 0 and 1

  constructor(public x: number, public y: number, public bias: Direction) {
    this.biasStrength = 0.9;
  }

  getForward() {
    switch (this.bias) {
      case Direction.NORTH:
        return { x: this.x, y: this.y + 1 };
      case Direction.EAST:
        return { x: this.x + 1, y: this.y };
      case Direction.SOUTH:
        return { x: this.x, y: this.y - 1 };
      case Direction.WEST:
        return { x: this.x - 1, y: this.y };
    }
  }

  getLeft() {
    // make a left turn
    switch (this.bias) {
      case Direction.NORTH:
        return { x: this.x - 1, y: this.y };
      case Direction.EAST:
        return { x: this.x, y: this.y + 1 };
      case Direction.SOUTH:
        return { x: this.x + 1, y: this.y };
      case Direction.WEST:
        return { x: this.x, y: this.y - 1 };
    }
  }

  getRight() {
    // make a right turn
    switch (this.bias) {
      case Direction.NORTH:
        return { x: this.x + 1, y: this.y };
      case Direction.EAST:
        return { x: this.x, y: this.y - 1 };
      case Direction.SOUTH:
        return { x: this.x - 1, y: this.y };
      case Direction.WEST:
        return { x: this.x, y: this.y + 1 };
    }
  }

  build() {
    this.length++;
    if (this.length >= 24) {
      return null;
    }

    // Calculate what direction the road will build in
    // Will the road continue to build in its biased direction?
    const continueInBiasedDir = Math.random() < this.biasStrength;
    if (continueInBiasedDir) {
      const { x, y } = this.getForward();
      this.x = x;
      this.y = y;
    } else {
      // Should we move to the left or the right?
      const moveToLeft = Math.random() > 0.5;
      if (moveToLeft) {
        const { x, y } = this.getLeft();
        this.x = x;
        this.y = y;
      } else {
        const { x, y } = this.getRight();
        this.x = x;
        this.y = y;
      }
    }

    // Return the value
    return {
      x: this.x,
      y: this.y,
      forked: null
    };
  }
}

@Injectable()
export class RoadManager {
  start() {
    const tiles = [];

    let ticking: Road[] = [new Road(0, 0, Direction.NORTH)];
    while (ticking.length) {
      // Tick on each of the roads
      ticking = ticking.filter(road => {
        const returned = road.build();
        if (!returned) {
          return false;
        }
        tiles.push({ x: returned.x, y: returned.y });
        return true;
      });
    }

    return tiles;
  }
}
