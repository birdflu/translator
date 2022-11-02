import {Layout} from "../geometry/geometry";

var xml = require('xml');

export class Drawio {
  public getDiagram(id: string) {
    return xml({
      mxCell: {
        _attr: {
          id: id,
        }
      }
    });
  }

  public getCanvas(id: string, parent: string) {
    return xml({
      mxCell: {
        _attr: {
          id: id,
          parent: parent
        }
      }
    });
  }

  public getElement(id: string, parent: string, value: string,
                    style: string, layout: Layout) {
    return xml({
      mxCell: [{
        _attr: {
          id: id,
          parent: parent,
          value: value,
          style: style,
          vertex: 1
        }
      },
        {
          mxGeometry: {
            _attr: {
              x: layout.x.toString(),
              y: layout.y.toString(),
              width: layout.width,
              height: layout.height,
              as: "geometry"
            }
          }
        }
      ]
    }, true)
  }

  public getRelativeElement(id: string, parent: string, value: string,
                            style: string, layout: Layout) {
    return xml({
      mxCell: [{
        _attr: {
          id: id,
          parent: parent,
          value: value,
          style: style,
          vertex: 1,

        }
      },
        {
          mxGeometry: [{
            _attr: {
              width: layout.width,
              height: layout.height,
              relative: "1",
              as: "geometry"
            }
          }, {
            mxPoint: {
              _attr: {
                x: layout.x.toString(),
                y: layout.y.toString(),
                as: "offset"
              }
            }
          }]
        }
      ]
    }, true)
  }

  public getHeader(host: string, modified: string, agent: string, etag: string, compressed: string, version: string,
                   type: string, diagram_id: string, diagram_name: string, dx: string, dy: string,
                   grid: string, gridSize: string, guides: string, tooltips: string, connect: string,
                   arrows: string, fold: string, page: string, pageScale: string, pageWidth: string,
                   pageHeight: string, math: string, shadow: string) {
    return xml({
      mxfile: [{
        _attr: {
          host: host,
          modified: modified,
          agent: agent,
          etag: etag,
          compressed: compressed,
          version: version,
          type: type
        }
      },
        {
          diagram: [{
            _attr: {
              id: diagram_id,
              name: diagram_name,
            }
          }, {
            mxGraphModel: [{
              _attr: {
                dx: dx,
                dy: dy,
                grid: grid,
                gridSize: gridSize,
                guides: guides,
                tooltips: tooltips,
                connect: connect,
                arrows: arrows,
                fold: fold,
                page: page,
                pageScale: pageScale,
                pageWidth: pageWidth,
                pageHeight: pageHeight,
                math: math,
                shadow: shadow
              }
            },
              {
                root: ['$ROOT']
              }]
          }]
        }
      ]
    }, true)
  }
}