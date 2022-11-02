import {Segment} from "./segment";
import {Point} from "./point";

export abstract class Intersection {

  private static Cross(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): Point {
    return new Point(
      (b1 * c2 - b2 * c1) / (a1 * b2 - a2 * b1),
      (a2 * c1 - a1 * c2) / (a1 * b2 - a2 * b1));
  }

  public static isPointCoordBetweenSegmentCoord(segment: Segment, pCross: Point, coord: string) {
    return (segment.dot1[coord] >= pCross[coord] && pCross[coord] >= segment.dot2[coord]) ||
      (segment.dot1[coord] <= pCross[coord] && pCross[coord] <= segment.dot2[coord]);
  }

  public static isSegmentIntersect(AB: Segment, CD: Segment): boolean {
    const a1 = AB.dot2.Y - AB.dot1.Y;
    const b1 = AB.dot1.X - AB.dot2.X;
    const c1 = -AB.dot1.X * AB.dot2.Y + AB.dot1.Y * AB.dot2.X;

    const a2 = CD.dot2.Y - CD.dot1.Y;
    const b2 = CD.dot1.X - CD.dot2.X;
    const c2 = -CD.dot1.X * CD.dot2.Y + CD.dot1.Y * CD.dot2.X;


    function isCrossOnSegment(segment: Segment, pCross: Point) {
      return Intersection.isPointCoordBetweenSegmentCoord(segment, pCross, "X") &&
        Intersection.isPointCoordBetweenSegmentCoord(segment, pCross, "Y");
    }

    // Straight lines are parallel
    if ((a1 * b2 - a2 * b1) == 0) {
      return false;
    }

    // Straight lines match
    if (a1 * b2 == b1 * a2 && a1 * c2 == a2 * c1 && b1 * c2 == c1 * b2) {
      return false;
    }

    // The cross point
    const pCross = Intersection.Cross(a1, b1, c1, a2, b2, c2);

    // Check segment intersect
    return isCrossOnSegment(new Segment(AB.dot1, AB.dot2), pCross) &&
      isCrossOnSegment(new Segment(CD.dot1, CD.dot2), pCross);

  }


}