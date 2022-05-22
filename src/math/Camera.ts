import {Vector2} from './Vector';
import {Xform2} from './Xform';

/**
 * A perspective used for rendering to a viewport.
 */
export class Camera {
  public position: Vector2;
  public angle: number = 0;
  public zoom: number;

  constructor(position: Vector2 = Vector2.zero(), zoom: number = 1) {
    this.position = position;
    this.zoom = zoom;
  }

  /**
   * Computes the transformation from world coordinates to camera
   * coordinates.
   */
  public xform(): Xform2 {
    return new Xform2(this.position, this.zoom, this.angle).inv();
  }

  /**
   * Computes the transform from camera coordinates to world
   * coordinates.
   */
  public invXform(): Xform2 {
    return new Xform2(this.position, this.zoom, this.angle);
  }
}
