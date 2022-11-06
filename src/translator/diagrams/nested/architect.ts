import Architecture from "../../architecture/architecture";
import settings from "../../settings.json";
import {ConsoleColors} from "../../../utils/consoleColors";
import {Geometry} from "../../geometry/geometry";
import {Obj} from "../../architecture/obj";
import {Point} from "../../geometry/point";
import {Rectangle} from "../../geometry/rectangle";
import {getColorKeyValue} from "../../../utils/log";

enum DiagramLayout {
  diagonal,
  list,
  centerList,
  stupidSquare,
  square,
}

export default class Architect {
  private _architecture: Architecture;

  constructor(architecture: Architecture) {
    this._architecture = architecture;
    this.setGeometry()
    architecture.log();
  }

  private setGeometry() {
    const maxHierarchyLevel = this._architecture.getMaxHierarchyLevel();

    if (maxHierarchyLevel < 1) {
      return;
    }

    switch (settings.diagram_layout.nested) {
      case DiagramLayout[DiagramLayout.diagonal]:
        this.setDiagonalGeometry(maxHierarchyLevel);
        break;
      case DiagramLayout[DiagramLayout.list]:
        this.setListGeometry(maxHierarchyLevel);
        break;
      case DiagramLayout[DiagramLayout.centerList]:
        this.setListGeometry(maxHierarchyLevel);
        this.centering(maxHierarchyLevel);
        break;
      case DiagramLayout[DiagramLayout.stupidSquare]:
        this.setStupidSquareGeometry(maxHierarchyLevel);
        break;
      case DiagramLayout[DiagramLayout.square]:
        this.setSquareGeometry(maxHierarchyLevel);
        break;
      default:
        break;
    }
  }

  private setListGeometry(level: number) {
    if (level < 1) return;

    for (const obj of this.getObjectsWithGeometry(level)) {
      const children = this._architecture.getLayerChildren(obj);
      Architect.putFirstChild(children.shift(), obj);
      for (const child of children) {
        Architect.putChildBottom(child, obj);
      }
    }
    this.setListGeometry(--level);
  }

  private setDiagonalGeometry(level: number) {
    if (level < 1) return;

    for (const obj of this.getObjectsWithGeometry(level)) {
      const children = this._architecture.getLayerChildren(obj);
      Architect.putFirstChild(children.shift(), obj);
      for (const child of children) {
        Architect.putChildOnRightBottomDiagonal(child, obj);
      }
    }
    this.setDiagonalGeometry(--level);
  }

  private setStupidSquareGeometry(level: number) {
    if (level < 1) return;

    for (const obj of this.getObjectsWithGeometry(level)) {
      const children = this._architecture.getLayerChildren(obj);
      Architect.putFirstChild(children.shift(), obj);
      for (const child of children) {
        const newPaddingHeight = obj.geometry.paddingHeight + child.geometry.layout.marginHeight;
        const newPaddingWidth = obj.geometry.paddingWidth + child.geometry.layout.marginWidth;
        if (newPaddingHeight <= newPaddingWidth) {
          Architect.putChildBottom(child, obj);
        } else {
          Architect.putChildRight(child, obj);
        }
      }
    }
    this.setStupidSquareGeometry(--level);
  }

  private setSquareGeometry(level: number) {
    if (level < 1) {
      return;
    }

    for (const obj of this.getObjectsWithGeometry(level)) {
      const children = this._architecture.getLayerChildren(obj);
      const addedChildren: Obj[] = [];
      const firstChild = children.shift();

      firstChild && Architect.putFirstChild(firstChild, obj);
      firstChild && addedChildren.push(firstChild);

      for (const child of children) {
        const cg = child.geometry;
        const og = obj.geometry;
        // find free space for the figure
        const parkedPoint: Point = parkChildInEmptyRegion(child, obj, addedChildren);

        if (parkedPoint != null) {
          if (settings.log_parking) {
            console.log(
              getColorKeyValue(`park`, child.name, ConsoleColors.blue) +
              getColorKeyValue(`, point`, `(${parkedPoint.X},${parkedPoint.Y})`,
                ConsoleColors.magenta));
          }

          child.geometry.layout.x = parkedPoint.X + child.geometry.marginLeft;
          child.geometry.layout.y = parkedPoint.Y + child.geometry.marginTop;
        } else {
          // if we cannot find free space then we try set the figure bottom or right
          // we choose the case when parent side length would be the smallest
          const bottomInnerHeight = og.paddingHeight + cg.layout.marginHeight;
          const rightInnerWidth = og.paddingWidth + cg.layout.marginWidth;
          if (bottomInnerHeight <= rightInnerWidth) {
            Architect.putChildBottom(child, obj);
          } else {
            Architect.putChildRight(child, obj);
          }
        }
        addedChildren.push(child);
      }
    }
    this.setSquareGeometry(--level);

    function parkChildInEmptyRegion(child: Obj, obj: Obj, addedChildren: Obj[]) {
      if (addedChildren.length < 2) return null;

      const cg = child.geometry;
      const og = obj.geometry;
      const addedRects: Rectangle[] = [];

      for (const a of addedChildren) {
        addedRects.push(new Rectangle(a));
      }

      let step = (settings.speed < 1) ? 1 : (settings.speed > 20) ? 20 : settings.speed;

      const childRect = new Rectangle(child);
      childRect.move(obj.geometry.left, obj.geometry.top);
      const isNotIntersect = function (rect: Rectangle): boolean {
        return (settings.use_quick_intersect_detection)
          ? childRect.quickNotIntersect(rect)
          : childRect.notIntersect(rect)
      };

      const startX = og.left;
      const endX = og.left + og.paddingWidth - cg.layout.marginWidth + 2;
      const startY = og.top;
      const endY = og.top + og.paddingHeight - cg.layout.marginHeight + 2;
      for (let x = startX; x < endX; x = x + step) {
        for (let y = startY; y < endY; y = y + step) {
          let intersectCount = addedRects.length;
          for (const addedRect of addedRects) {
            if (isNotIntersect(addedRect)) {
              intersectCount--;
            }
          }

          if (intersectCount == 0) {
            // quality improvement
            if (step == 1) {
              return new Point(x, y);
            } else {
              x = x - step;
              y = y - step;
              childRect.move(x - step, y - step);
              step = 1;
              continue;
            }
          }
          childRect.shiftY(step);
        }
        childRect.move(x + 1, startY);
      }
      return null;
    }
  }

  private static setDefaultGeometry(objects: Obj[]) {
    for (const obj of objects) {
      obj.geometry = new Geometry(settings.geometry[obj.kind]);
      if (obj.geometry.nameFormat) {
        const sizeFieldName: number = obj.meta[settings.size_field_name];
        const size: number = Math.sqrt(sizeFieldName) / settings.scale;
        obj.geometry.style =
          obj.geometry.style + "fontSize=" +
          (Math.round(Math.sqrt(size)) > 7 ? Math.round(1.8 * Math.sqrt(size)) : 12);
        obj.geometry.paddingWidth = obj.geometry.paddingWidth + size;
        obj.geometry.paddingHeight = obj.geometry.paddingHeight + size;
      }
    }
  }

  private static putChildBottom(child: Obj, parent: Obj) {
    const cg = child.geometry;
    const og = parent.geometry;
    cg.layout.x = cg.marginLeft + og.left;
    cg.layout.y = cg.marginTop + og.top + og.paddingHeight + 1;
    og.paddingHeight = og.paddingHeight + cg.layout.marginHeight + 1;
    og.paddingWidth = Math.max(og.paddingWidth, cg.layout.marginWidth);
  }

  private static putChildRight(child: Obj, obj: Obj) {
    const cg = child.geometry;
    const og = obj.geometry;
    cg.layout.x = cg.marginLeft + og.left + og.paddingWidth + 1;
    cg.layout.y = cg.marginTop + og.top;
    og.paddingHeight = Math.max(og.paddingHeight, cg.layout.marginHeight);
    og.paddingWidth = og.paddingWidth + cg.layout.marginWidth + 1;
  }

  private static putChildOnRightBottomDiagonal(child: Obj, obj: Obj) {
    const cg = child.geometry;
    const og = obj.geometry;
    cg.layout.x = cg.marginLeft + og.layout.width;
    cg.layout.y = cg.marginTop + og.layout.height;
    og.paddingHeight = og.paddingHeight + cg.layout.marginHeight + 1;
    og.paddingWidth = og.paddingWidth + cg.layout.marginWidth + 1;
  }

  private static putFirstChild(child: Obj, obj: Obj) {
    if (!child) return;

    const cg = child.geometry;
    const og = obj.geometry;
    cg.layout.x = cg.marginLeft + og.left;
    cg.layout.y = cg.marginTop + og.top;
    og.paddingHeight = cg.layout.marginHeight;
    og.paddingWidth = cg.layout.marginWidth;
  }

  private getObjectsWithGeometry(level: number) {
    const objects = this._architecture.getObjectsByLevel().get(level);
    Architect.setDefaultGeometry(objects);
    return objects.filter((o) => o.geometry);
  }

  private centering(level: number) {
    if (level < 1) return;
    const objects = this._architecture.getObjectsByLevel().get(level);

    for (const obj of objects) {
      const children = this._architecture.getLayerChildren(obj);
      const maxWidth = Math.max(...children.map((c) => c.geometry.layout.width));

      for (const child of children) {
        const cg = child.geometry;
        cg.layout.x = cg.layout.x + ((maxWidth - cg.layout.width) / 2);
      }
    }

    this.centering(--level);
  }

  get architecture(): Architecture {
    return this._architecture;
  }
}