import { Injectable } from '@angular/core';
import { Road } from './road';
import { Direction } from './shared';

@Injectable()
export class RoadManager {
  ticking: Road[];
  tiles: any[];

  start() {
    this.ticking = [
      new Road(0, 0, Direction.NORTH),
      new Road(0, 0, Direction.EAST),
      new Road(0, 0, Direction.SOUTH),
      new Road(0, 0, Direction.WEST)
    ];
    this.tiles = [];
    console.time('roadGenTime');
    this.tick();
    console.timeEnd('roadGenTime');
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
