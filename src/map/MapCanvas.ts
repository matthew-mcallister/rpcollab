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

/**
 * Canvas-based controller which draws the map and processes interaction.
 * Should take any state as a parameter so it can be used in React
 * components.
 */
export default class MapCanvas {
  private map: MapModel;
  private ctx: CanvasRenderingContext2D | null = null;

  public camera: Camera = new Camera();
  private xform: Xform2 = new Xform2();

  constructor(map: MapModel) {
    this.map = map;
  }

  public attach(canvas: HTMLCanvasElement): void {
    this.ctx = canvas.getContext('2d');
  }

  public detach(): void {
    this.ctx = null;
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

  public updateCamera(): void {
    const t = performance.now() / 1000;
    this.camera.position = new Vector2(
      700 + 10 * (1 + Math.cos((1.227 * t) / 2)),
      850 + 10 * (1 + Math.sin((2.865 * t) / 2))
    );
    this.camera.zoom = 1 + 0.1 * Math.sin(0.2112 * t);
    this.camera.angle = (Math.PI / 32) * Math.sin(0.15 * t);

    this.updateXform();
  }

  public updateXform(): void {
    const camera = this.camera.xform();
    const canvas = this.canvasXform();
    this.xform = canvas.mul(camera);
  }

  public render(): void {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.updateCamera();

    const r = 10;
    const h = 2 * r * Math.sin(Math.PI / 3);

    const dx = r * (1 + Math.cos(Math.PI / 3));
    const dy = h;

    const x_0 = r;
    for (let j = 0; j < this.map.width; j++) {
      const y_0 = j % 2 === 1 ? h : h / 2;
      for (let i = 0; i < this.map.height; i++) {
        const cell = this.map.cells[j][i];
        if (!cell) {
          console.log('missing cell', j, i);
        }

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
