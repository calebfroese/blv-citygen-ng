import { Injectable } from '@angular/core';

export enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST
}

export class Road {
  directionalBias: number; // between 0 and 1
  forkChance: number; // between 0 and 1
  lastDirectionChangeAtLength = 0;

  constructor(
    public x: number,
    public y: number,
    public bias: Direction,
    public length: number = 0
  ) {
    this.directionalBias = 0.9;
    this.forkChance = 0.2;
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
    if (this.length >= 50) {
      return null;
    }

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
