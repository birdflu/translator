import {getColorKeyValue} from "../../utils/log";
import {ConsoleColors} from "../../utils/consoleColors";

export class Geometry {
  style: string;
  nameFormat: any;        //       (0)----------------------- 13 ------------------------------> (x)
  top: number;            //  0      |                                   |                  |
  paddingHeight: number;  //  1      |                                   6                  |
  bottom: number;         //  2      |      __________________ 11 _______|____________      |
  left: number;           //  3      |      |               |                        |      |
  paddingWidth: number;   //  4      |_ 8 __|               0                        |_ 9 __|
  right: number;          //  5      |      |               |                        |      |
  marginTop: number;      //  6      |      |            ___|_______________         |      |
  marginBottom: number;   //  7      |      |           |                   |        |      |
  marginLeft: number;     //  8     12     10           1                   |        |      |
  marginRight: number;    //  9      |      |           |                   |        |      |
  layout: Layout;         //         |      |---- 3 ----|                   |-- 5 ---|      |
                          //         |      |           |_______ 4 _________|        |      |
                          //         |      |              |                         |      |
                          //         |      |              2                         |      |
                          //         |      |______________|_________________________|      |
                          //         |                                    |                 |
                          //         |                                    7                 |
                          //         |____________________________________|_________________|
                          //        \/
                          //        (y)

  constructor(value: {
    style: string, nameFormat: any,
    top: number, paddingHeight: number, bottom: number,
    left: number, paddingWidth: number, right: number,
    marginTop: number, marginBottom: number, marginLeft: number, marginRight: number
  }) {
    this.style = value.style;
    this.nameFormat = value.nameFormat;
    this.top = value.top;
    this.paddingHeight = value.paddingHeight;
    this.bottom = value.bottom;
    this.left = value.left;
    this.paddingWidth = value.paddingWidth;
    this.right = value.right;
    this.marginTop = value.marginTop;
    this.marginBottom = value.marginBottom;
    this.marginLeft = value.marginLeft;
    this.marginRight = value.marginRight;
    this.layout = new Layout(this);
  }

  public toString() {
    return `
    {
      ${getColorKeyValue("top", this.top, ConsoleColors.blue)}
      ${getColorKeyValue("paddingHeight", this.paddingHeight, ConsoleColors.blue)}
      ${getColorKeyValue("bottom", this.bottom, ConsoleColors.blue)}
      ${getColorKeyValue("left", this.left, ConsoleColors.blue)}
      ${getColorKeyValue("paddingWidth", this.paddingWidth, ConsoleColors.blue)}
      ${getColorKeyValue("right", this.right, ConsoleColors.blue)}
      ${getColorKeyValue("marginTop", this.marginTop, ConsoleColors.blue)}
      ${getColorKeyValue("marginBottom", this.marginBottom, ConsoleColors.blue)}
      ${getColorKeyValue("marginLeft", this.marginLeft, ConsoleColors.blue)}
      ${getColorKeyValue("marginRight", this.marginRight, ConsoleColors.blue)}
      ${getColorKeyValue("layout", this.layout, ConsoleColors.white)}
    } 
`;
  }
}

export class Layout {
  private geometry: Geometry;
  x: number;
  y: number;

  constructor(geometry) {
    this.geometry = geometry;
    this.x = Math.floor((Math.random() * 400) + 1);
    this.y = Math.floor((Math.random() * 400) + 1);
  }

  // 10
  public get height(): number {
    return this.geometry.top + this.geometry.paddingHeight + this.geometry.bottom;
  }

  // 11
  public get width(): number {
    return this.geometry.left + this.geometry.paddingWidth + this.geometry.right;
  }

  // 12
  public get marginHeight(): number {
    return this.geometry.marginTop + this.height + this.geometry.marginBottom;
  }

  // 13
  public get marginWidth(): number {
    return this.geometry.marginLeft + this.width + this.geometry.marginRight;
  }

  public toString() {
    return `
      {
        ${getColorKeyValue("x", this.x, ConsoleColors.blue)}
        ${getColorKeyValue("y", this.y, ConsoleColors.blue)}
        ${getColorKeyValue("height", this.height, ConsoleColors.blue)}
        ${getColorKeyValue("width", this.width, ConsoleColors.blue)}
      }`;
  }


}