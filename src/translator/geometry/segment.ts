import {Point} from "./point";

export class Segment {
  dot1: Point;
  dot2: Point;

  constructor(dot1: Point, dot2: Point) {
    this.dot1 = dot1;
    this.dot2 = dot2;
  }
}