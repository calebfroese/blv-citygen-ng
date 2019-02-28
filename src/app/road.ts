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

  done: boolean;

  constructor(
    public x: number,
    public y: number,
    public bias: Direction,
    public length: number = 0
  ) {
    this.directionalBias = 0.9;
    this.forkChance = 0;
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
        return { x: this.x - 1, y: this.y, bias: Direction.WEST };
      case Direction.EAST:
        return { x: this.x, y: this.y + 1, bias: Direction.NORTH };
      case Direction.SOUTH:
        return { x: this.x + 1, y: this.y, bias: Direction.EAST };
      case Direction.WEST:
        return { x: this.x, y: this.y - 1, bias: Direction.SOUTH };
    }
  }

  getRight() {
    // make a right turn
    switch (this.bias) {
      case Direction.NORTH:
        return { x: this.x + 1, y: this.y, bias: Direction.EAST };
      case Direction.EAST:
        return { x: this.x, y: this.y - 1, bias: Direction.SOUTH };
      case Direction.SOUTH:
        return { x: this.x - 1, y: this.y, bias: Direction.WEST };
      case Direction.WEST:
        return { x: this.x, y: this.y + 1, bias: Direction.NORTH };
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
        const { x, y } = this.getForward();
        forked = new Road(x, y, this.bias, this.length);
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
    if (this.length >= 50) {
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

@Injectable()
export class RoadManager {
  ticking: Road[];
  tiles: any[];

  start() {
    this.ticking = [new Road(0, 0, Direction.NORTH)];
    this.tiles = [];
    this.tick();
    return this.tiles;
  }

  tick() {
    this.ticking.forEach(road => {
      if (road.done === true) {
        return;
      }
      const returned = road.build();
      if (returned.forked) {
        this.ticking.push(returned.forked);
      }
      this.tiles.push({ x: returned.x, y: returned.y });
      return true;
    });

    // Continue the tick
    const stillTicking = this.ticking.filter(road => !road.done).length;
    if (stillTicking > 0) {
      this.tick();
    }
  }
}
