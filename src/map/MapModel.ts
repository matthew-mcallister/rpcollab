import Color from '../math/Color';
import {Vector2} from '../math/Vector';

/**
 * A hex cell in a map.
 */
export class Cell {
  public readonly x: number;
  public readonly y: number;
  public color: Color;

  constructor(x: number, y: number, color: Color = new Color(1, 1, 1)) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public deserialize(data: any): void {
    Object.assign(this.color, data.color);
  }
}

/**
 * Models a map from the frontend perspective. MapModel provides methods
 * for accessing and mutating the map while MapCanvas is responsible
 * for allowing the user to interact with the map.
 *
 * The map cells are stored column-major, so indexing is horizontal
 * first, then vertical.
 */
export default class MapModel {
  public width: number;
  public height: number;
  public cells: Cell[][];

  constructor(width: number, height: number) {
    this.width = this.height = 0;
    this.cells = [[]];
    this.resize(width, height);
  }

  public get(x: number, y: number): Cell | undefined {
    return (this.cells[x] || [])[y];
  }

  public deserialize(object: any): void {
    this.resize(object.width, object.height);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y].deserialize(object.cells[x][y]);
      }
    }
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells.length = width;
    for (let x = 0; x < width; x++) {
      this.cells[x] = this.cells[x] || [];
      this.cells[x].length = height;
      for (let y = 0; y < height; y++) {
        this.cells[x][y] = this.cells[x][y] || new Cell(x, y);
      }
    }
  }

  public coordsAtPosition(pos: Vector2): Vector2 {
    // Caution: slick math ahead
    const h = Math.sin(Math.PI / 3);
    const r = pos.sub(new Vector2(0, h));
    const [a, b] = [r.x, r.y / Math.sqrt(3)];
    const [u, v] = [Math.floor(a + b), Math.floor(a - b)];
    const i = Math.floor((u + v) / 3);

    const k = Math.floor(pos.y / h) - Math.floor(i % 2);
    const j = Math.floor(k / 2);

    return new Vector2(i, j);
  }

  /**
   * Finds which cell, if any, is under the given point.
   *
   * It is assumed that the radius of a cell is 1 and that (0, 0) is the
   * upper-left corner of the bounding map rectangle.
   */
  public cellAtPosition(pos: Vector2): Cell | null {
    const p = this.coordsAtPosition(pos);
    return (this.cells[p.x] || [])[p.y] || null;
  }
}
