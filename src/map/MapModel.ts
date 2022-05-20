import Color from '../math/Color';

/**
 * A hex cell in a map.
 */
export class Cell {
  public readonly x: number;
  public readonly y: number;
  public color: Color;

  constructor(x: number, y: number, color: Color = new Color(0.5, 0.5, 0.5)) {
    this.color = color;
  }
}

/**
 * Models a map from the frontend perspective. MapModel provides methods
 * for accessing and mutating the map while MapCanvas is responsible
 * for allowing the user to interact with the map.
 */
export default class MapModel {
  public width: number;
  public height: number;
  public cells: Cell[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (let x = 0; x < width; x++) {
      this.cells[x] = [];
      for (let y = 0; y < height; y++) {
        this.cells[x][y] = new Cell(x, y);
      }
    }
  }
}
