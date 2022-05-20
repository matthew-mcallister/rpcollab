import {Vector2} from './Vector';

/**
 * Represents an affine transformation.
 */
// TODO: Rotation-free version for better performance?
export class Xform2 {
  public scale: number;
  public angle: number;
  public offset: Vector2;

  constructor(
    offset: Vector2 = new Vector2(0, 0),
    scale: number = 1,
    angle: number = 0
  ) {
    this.offset = offset;
    this.scale = scale;
    this.angle = angle;
  }

  public apply(v: Vector2): Vector2 {
    return new Vector2(
      this.offset.x +
        this.scale * (v.x * Math.cos(this.angle) - v.y * Math.sin(this.angle)),
      this.offset.y +
        this.scale * (v.x * Math.sin(this.angle) + v.y * Math.cos(this.angle))
    );
  }

  public mul(xform: Xform2): Xform2 {
    return new Xform2(
      this.apply(xform.offset),
      this.scale * xform.scale,
      this.angle + xform.angle
    );
  }

  public inv(): Xform2 {
    const t = this.offset
      .neg()
      .rotate(-this.angle)
      .mul(1 / this.scale);
    return new Xform2(t, 1 / this.scale, -this.angle);
  }
}
