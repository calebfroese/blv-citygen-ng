import { Injectable } from '@angular/core';
import { Road } from './road';
import { Direction } from './shared';
import { getForward, getLeft, getRight } from './direction-util';

@Injectable()
export class RoadManager {
  ticking: Road[];
  tilesIndexed: string[] = []; // indexed `${x},${y}` for finding if tiles exist
  tiles: any[] = [];

  start(x, y) {
    console.log('cleared tiles');
    // this.tiles = [];
    this.ticking = [
      new Road(x, y, Direction.NORTH, this),
      new Road(x, y, Direction.EAST, this),
      new Road(x, y, Direction.SOUTH, this),
      new Road(x, y, Direction.WEST, this)
    ];
    console.time('roadGenTime');
    this.tick();
    console.timeEnd('roadGenTime');
    return this.tiles;
  }

  tileExists(x: number, y: number, bias: Direction) {
    /**
     * Check if there is a tile:
     * - In those coordinates
     * - Forward and left of the coords
     * - Forward and right of the coords
     */
    const forward = getForward(x, y, bias);
    const forwardLeft = getLeft(forward.x, forward.y, bias);
    const forwardRight = getRight(forward.x, forward.y, bias);
    return (
      this.tilesIndexed.includes(`${forward.x},${forward.y}`) ||
      this.tilesIndexed.includes(`${forwardLeft.x},${forwardLeft.y}`) ||
      this.tilesIndexed.includes(`${forwardRight.x},${forwardRight.y}`)
    );
  }

  tick() {
    this.ticking.forEach(road => {
      if (road.done) {
        return;
      }
      const returned = road.build();
      if (!returned) {
        return;
      }
      if (returned.forked) {
        this.ticking.push(returned.forked);
      }
      this.tilesIndexed.push(`${returned.x},${returned.y}`);
      this.tiles.push({ x: returned.x, y: returned.y });
    });

    // Continue the tick
    const stillTicking = this.ticking.filter(road => !road.done).length;
    if (stillTicking > 0) {
      this.tick();
    }
  }
}
