export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public array(): [number, number] {
    return [this.x, this.y];
  }

  public neg(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  public add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  public sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  public mul(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  public dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  public rotate(angle: number): Vector2 {
    return new Vector2(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    );
  }
}
