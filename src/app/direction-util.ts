import { Direction } from './shared';

export function getForward(x: number, y: number, direction: Direction) {
  switch (direction) {
    case Direction.NORTH:
      return { x: x, y: y - 1 };
    case Direction.EAST:
      return { x: x + 1, y: y };
    case Direction.SOUTH:
      return { x: x, y: y + 1 };
    case Direction.WEST:
      return { x: x - 1, y: y };
  }
}

export function getLeft(x: number, y: number, direction: Direction) {
  // make a left turn
  switch (direction) {
    case Direction.NORTH:
      return { x: x - 1, y: y, bias: Direction.WEST };
    case Direction.EAST:
      return { x: x, y: y - 1, bias: Direction.NORTH };
    case Direction.SOUTH:
      return { x: x + 1, y: y, bias: Direction.EAST };
    case Direction.WEST:
      return { x: x, y: y + 1, bias: Direction.SOUTH };
  }
}

export function getRight(x: number, y: number, direction: Direction) {
  // make a right turn
  switch (direction) {
    case Direction.NORTH:
      return { x: x + 1, y: y, bias: Direction.EAST };
    case Direction.EAST:
      return { x: x, y: y + 1, bias: Direction.SOUTH };
    case Direction.SOUTH:
      return { x: x - 1, y: y, bias: Direction.WEST };
    case Direction.WEST:
      return { x: x, y: y - 1, bias: Direction.NORTH };
  }
}
