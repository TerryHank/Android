export interface Coordinate {
  x: number;
  y: number;
  z: number;
  finishX: number;
  finishY: number;
  finishZ: number;
  index: number;
}

export interface KeyboardCoordinate {
  x: number;
  y: number;
}

export interface KeyboardButton {
  xIndex: number;
  yIndex: number;
  name: string;
  height: number;
  leftBottom: KeyboardCoordinate;
  rightTop: KeyboardCoordinate;
}
