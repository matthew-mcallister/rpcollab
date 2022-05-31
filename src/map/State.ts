import {Camera} from '../math/Camera';
import {Vector2} from '../math/Vector';
import {Xform2} from '../math/Xform';
import MapModel, {Cell} from './MapModel';
import Toolbox from './tool/Toolbox';

const ZEROES = new Array(15);
for (let i = 0; i < ZEROES.length; i += 1) {
  ZEROES[i] = 0;
}

/**
 * This represents the main state of the map canvas controller. Multiple
 * sub-controllers hold internal bits of state for themselves, but they
 * mutate this state object to communicate with each other and control
 * rendering and interaction.
 */
export default class MapEditorState {
  // Inputs to the controllers
  public readonly map: MapModel;
  public canvas: HTMLCanvasElement | null = null;
  public scale: number = 10;

  // Map view state
  public camera = new Camera();
  public cursorWorldPos = new Vector2();
  public highlightedCell: Cell | null = null;

  // Tool state
  public toolbox = new Toolbox();

  // Performance, metrics, status
  public frame: number = 0;
  private _fps: number = 0;
  private frameTimes: number[];

  constructor(map: MapModel) {
    this.map = map;
    this.frameTimes = [...ZEROES];
  }

  public fps() {
    if (this.frame % this.frameTimes.length === 0) {
      this._fps =
        this.frameTimes.reduce((a, b) => a + 1000 / b, 0) /
        this.frameTimes.length;
    }
    return this._fps;
  }

  public addFrame(time: number) {
    this.frameTimes[this.frame % this.frameTimes.length] = time;
  }

  /**
   * Computes an AABB to use for culling grid cells not in view of the
   * camera. Assumes the camera is not rotated at all.
   */
  public cameraAabb(): [Vector2, Vector2] {
    const xform = this.canvasToWorld();
    const ul = xform.apply(new Vector2(0, 0));
    const lr = xform.apply(new Vector2(this.canvas.width, this.canvas.height));
    return [ul, lr];
  }

  /**
   * Computes the transform fron camera space to canvas space.
   *
   * Unlike in 3D, there is no perspective transform and no clip space.
   * We need only apply a DPI scaling factor and an offset so the camera
   * is centered on the middle of the viewport.
   */
  public canvasXform(): Xform2 {
    const canvas = this.canvas;
    const offset = new Vector2(canvas.width / 2, canvas.height / 2);
    return new Xform2(offset, window.devicePixelRatio);
  }

  /**
   * Transform from world coordinates to screen coordinates via the
   * current camera.
   */
  public worldToCanvas(): Xform2 {
    const camera = this.camera.xform();
    const canvas = this.canvasXform();
    return canvas.mul(camera);
  }

  /** Inverse transformation of worldToCanvas(). */
  public canvasToWorld(): Xform2 {
    return this.worldToCanvas().inv();
  }
}
