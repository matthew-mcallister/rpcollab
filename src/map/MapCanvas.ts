import Color, {ColorHsv} from '../math/Color';
import {Vector2} from '../math/Vector';
import {Xform2} from '../math/Xform';
import MapModel from './MapModel';

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
}

class CameraController {
  public camera: Camera;
  public dragging: boolean = false;

  constructor() {
    this.camera = new Camera();
  }

  zoomFactor(): number {
    return (2 * window.devicePixelRatio) / this.camera.zoom;
  }

  public onMouseDown(event: MouseEvent): void {
    if (event.button === 1 || (event.button == 0 && event.shiftKey)) {
      this.dragging = true;
    }
  }

  public onMouseUp(event: MouseEvent): void {
    if (event.button === 1 || (event.button == 0 && event.shiftKey)) {
      this.dragging = false;
    }
  }

  public onMouseMove(event: MouseEvent): void {
    // TODO: Preserve momentum when releasing
    if (!this.dragging) {
      return;
    }
    // TODO: IDK what the exact formula is but this works on my browser.
    this.camera.position.x -= event.movementX / this.zoomFactor();
    this.camera.position.y -= event.movementY / this.zoomFactor();
  }

  public onWheel(event: WheelEvent): void {
    // TODO: Probably shouldn't use FP math for this.
    if (event.deltaY < 0) {
      this.camera.zoom /= 1.1;
    } else {
      this.camera.zoom *= 1.1;
    }
  }

  // TODO: This is really awkward; it may be better to have one
  // top-level canvas event listener that forwards the events to
  // the appropriate handlers.
  public attach(canvas: HTMLCanvasElement): void {
    const controller = this;

    function mousedown(event: MouseEvent) {
      controller.onMouseDown(event);
    }
    function mouseup(event: MouseEvent) {
      controller.onMouseUp(event);
    }
    function mousemove(event: MouseEvent) {
      controller.onMouseMove(event);
    }
    function wheel(event: WheelEvent) {
      controller.onWheel(event);
    }

    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mouseup', mouseup);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('wheel', wheel);

    controller.detach = () => {
      canvas.removeEventListener('mousedown', mousedown);
      canvas.removeEventListener('mouseup', mouseup);
      canvas.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('wheel', wheel);
      controller.detach = () => {};
    };
  }

  public detach(): void {}
}

/**
 * Canvas-based controller which draws the map and processes interaction.
 * Should take any state as a parameter so it can be used in React
 * components.
 */
export default class MapCanvas {
  private map: MapModel;
  private ctx: CanvasRenderingContext2D | null = null;

  private cameraController: CameraController = new CameraController();
  private xform: Xform2 = new Xform2();

  constructor(map: MapModel) {
    this.map = map;
  }

  public attach(canvas: HTMLCanvasElement): void {
    this.ctx = canvas.getContext('2d');
    this.cameraController.attach(canvas);
  }

  public detach(): void {
    this.ctx = null;
    this.cameraController.detach();
  }

  /**
   * Computes the transform fron camera space to canvas space.
   *
   * Unlike in 3D, there is no perspective transform and no clip space.
   * We need only apply a DPI scaling factor and an offset so the camera
   * is centered on the middle of the viewport.
   */
  public canvasXform(): Xform2 {
    const canvas = this.ctx.canvas;
    const offset = new Vector2(canvas.width / 2, canvas.height / 2);
    return new Xform2(offset, window.devicePixelRatio);
  }

  private polyPath(xs: Vector2[]) {
    this.ctx.beginPath();

    let p = this.xform.apply(xs[0]);
    this.ctx.moveTo(p.x, p.y);

    for (let p of xs.slice(1)) {
      p = this.xform.apply(p);
      this.ctx.lineTo(p.x, p.y);
    }

    this.ctx.closePath();
  }

  // TODO: culling
  private drawHex(
    p: Vector2,
    r: number,
    color: Color,
    strokeColor?: Color
  ): void {
    this.ctx.fillStyle = color.toHex({prefix: true});
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor.toHex({prefix: true});
    }

    const dx = r * Math.cos(Math.PI / 3);
    const dy = r * Math.sin(Math.PI / 3);
    const [x, y] = p.array();

    this.polyPath([
      new Vector2(x + r, y),
      new Vector2(x + dx, y + dy),
      new Vector2(x - dx, y + dy),
      new Vector2(x - r, y),
      new Vector2(x - dx, y - dy),
      new Vector2(x + dx, y - dy),
    ]);

    this.ctx.fill();
    if (strokeColor) {
      this.ctx.stroke();
    }
  }

  public updateXform(): void {
    const camera = this.cameraController.camera.xform();
    const canvas = this.canvasXform();
    this.xform = canvas.mul(camera);
  }

  public render(): void {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.updateXform();

    const r = 10;
    const h = 2 * r * Math.sin(Math.PI / 3);

    const dx = r * (1 + Math.cos(Math.PI / 3));
    const dy = h;

    const x_0 = r;
    for (let j = 0; j < this.map.width; j++) {
      const y_0 = j % 2 === 1 ? h : h / 2;
      for (let i = 0; i < this.map.height; i++) {
        const cell = this.map.cells[j][i];

        const strokeColor = new Color(0, 0, 0);
        const p = new Vector2(x_0 + j * dx, y_0 + i * dy);

        this.drawHex(p, r, cell.color, strokeColor);
      }
    }
  }

  public renderLoop(): void {
    if (!this.ctx) {
      // Detached; quit rendering
      return;
    }
    this.render();
    window.requestAnimationFrame(() => this.renderLoop());
  }
}
