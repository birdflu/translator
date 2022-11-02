import {Obj} from "../architecture/obj";
import {Intersection} from "./intersection";
import {Segment} from "./segment";
import {Point} from "./point";

export class Rectangle {//              top
                        //      lt _______________rt
  lt: Point;            //      |   ___________    |
  rt: Point;            //      |  |(x,y)      |   |
  lb: Point;            //  left|  |     Obj   |   |right
  rb: Point;            //      |  |___________|   |
                        //      lb _______________rb
  top: Segment;         //              bottom
  left: Segment;
  right: Segment;
  bottom: Segment;
  segments: Segment[];

  constructor(obj: Obj) {
    const og = obj.geometry;
    const topY = og.layout.y - og.marginTop;
    const leftX = og.layout.x - og.marginLeft;
    const rightX = og.layout.x + og.layout.width + og.marginRight;
    const bottomY = og.layout.y + og.layout.height + og.marginBottom;
    this.lt = new Point(leftX, topY);
    this.rt = new Point(rightX, topY);
    this.lb = new Point(leftX, bottomY);
    this.rb = new Point(rightX, bottomY);

    this.top = new Segment(this.lt, this.rt);
    this.left = new Segment(this.lt, this.lb);
    this.right = new Segment(this.rt, this.rb);
    this.bottom = new Segment(this.lb, this.rb);
    this.segments = [this.top, this.left, this.right, this.bottom];
  }

  public shiftX(dx: number) {
    this.lt.X += dx;
    this.rt.X += dx;
    this.lb.X += dx;
    this.rb.X += dx;
  }

  public shiftY(dy: number) {
    this.lt.Y += dy;
    this.rt.Y += dy;
    this.lb.Y += dy;
    this.rb.Y += dy;
  }

  public in(rect: Rectangle) {
    return this.lt.X >= rect.lt.X && this.lt.Y >= rect.lt.Y &&
      this.rt.X <= rect.rt.X && this.rt.Y >= rect.rt.Y &&
      this.lb.X >= rect.lb.X && this.lb.Y <= rect.lb.Y &&
      this.rb.X <= rect.rb.X && this.rb.Y <= rect.rb.Y;
  }

  public intersect(rect: Rectangle) {
    return Intersection.isSegmentIntersect(this.left, rect.top) ||
      Intersection.isSegmentIntersect(this.left, rect.bottom) ||
      Intersection.isSegmentIntersect(this.right, rect.top) ||
      Intersection.isSegmentIntersect(this.right, rect.bottom) ||
      Intersection.isSegmentIntersect(this.top, rect.left) ||
      Intersection.isSegmentIntersect(this.top, rect.right) ||
      Intersection.isSegmentIntersect(this.bottom, rect.left) ||
      Intersection.isSegmentIntersect(this.bottom, rect.right)
  }

  // use only for correctly oriented rectangles
  public quickNotIntersect(rect: Rectangle) {
    return (
      (this.rt.X < rect.lt.X) ||
      (rect.rt.X < this.lt.X) ||
      (this.lb.Y < rect.lt.Y) ||
      (rect.lb.Y < this.lt.Y));
  }

  public move(x: number, y: number) {
    this.shiftX(x - this.lt.X);
    this.shiftY(y - this.lt.Y);
  }

  public notIntersect(addedRect: Rectangle) {
    return (!this.in(addedRect)) && (!this.intersect(addedRect));
  }
}