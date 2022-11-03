export interface IYAMLRoot {
  elements: IYAMLElements[];
}

export interface IYAMLElements {
  kind:              string;
  name:              string;
  yamlId?:           string;
  parentYamlId?:     null | string;
  тип?:              string;
  сумма?:            number;
}