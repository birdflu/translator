## Description
Translator is the small "diagram as code" service. It converts json-data to draw.io diagram format.
It generates a geometry layout and presents data elements as geometry figures. 
If the data has a hierarchy, then geometry elements have hierarchical nesting too.       

## Install and start
> npm install
> npm start

## Use service example
> curl -X POST --data-binary @data/sales.json -H "Content-type: text/x-yaml" http://localhost:5000/diagram

## Result

Translator gets the input data json file like this:

```
{
"elements": 
  [
   {
      "kind": "Kingdom",
      "name": "Kingdom Fungi",
      "id": "Kingdom", // unique ID
      "idParent": null
   },
   {
      "kind": "SubKingdom",
      "name": "Hat",
      "id": "Hat",
      "idParent": "Kingdom"
   },
   {
      "kind": "SubKingdom",
      "name": "Parasite",
      "id": "Parasite",
      "idParent": "Kingdom"
    },
    {
      "kind": "SubKingdom",
      "name": "Mould",
      "id": "Mould",
      "idParent": "Kingdom"
    },
    ...
  ]
}
```
and generates diagram like this: 

![](data/diagram.jpg)

## Input data format

The input file consists of two sections: 
1) data section "elements"
2) settings section "settings"

### Data section:

Data section has 

```
{
  "kind": user type of element
  "name": element name
  "id": unique element ID
  "idParent": element's parent ID 
  "type": (optional) addition type of tree leaf element for element image
  "total": (optional)  of tree leaf element
  }
}
```

### Settings section:

// to be continued ...