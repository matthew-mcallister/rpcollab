import Color, {ColorHsv} from '../math/Color';
import {Vector2} from '../math/Vector';
import {Xform2} from '../math/Xform';
import MapModel from './MapModel';

/**
 * A perspective used for rendering a map.
 */
export class Camera {
  public position: Vector2;
  public angle: number = 0;
  public zoom: number;

  constructor(position: Vector2 = Vector2.zero(), zoom: number = 1) {
    this.position = position;
    this.zoom = zoom;
  }

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

  attach(canvas: HTMLCanvasElement): void {
    this.ctx = canvas.getContext('2d');
  }

  detach(): void {
    this.ctx = null;
  }

  // TODO: culling
  drawHex(p: Vector2, r: number, color: Color, strokeColor?: Color): void {
    this.ctx.fillStyle = color.toHex({prefix: true});
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor.toHex({prefix: true});
    }

    const dx = r * Math.cos(Math.PI / 3);
    const dy = r * Math.sin(Math.PI / 3);
    const [x, y] = p.array();
    this.ctx.beginPath();
    p = this.xform.mul(new Vector2(x + r, y));
    this.ctx.moveTo(p.x, p.y);
    p = this.xform.mul(new Vector2(x + dx, y + dy));
    this.ctx.lineTo(p.x, p.y);
    p = this.xform.mul(new Vector2(x - dx, y + dy));
    this.ctx.lineTo(p.x, p.y);
    p = this.xform.mul(new Vector2(x - r, y));
    this.ctx.lineTo(p.x, p.y);
    p = this.xform.mul(new Vector2(x - dx, y - dy));
    this.ctx.lineTo(p.x, p.y);
    p = this.xform.mul(new Vector2(x + dx, y - dy));
    this.ctx.lineTo(p.x, p.y);
    this.ctx.closePath();
    this.ctx.fill();
    if (strokeColor) {
      this.ctx.stroke();
    }
  }

  render(): void {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    const r = 10;
    const h = r * Math.sin(Math.PI / 3);
    const dx = 2 * r * (1 + Math.cos(Math.PI / 3));
    const dy = h;

    const t = performance.now() / 1000;
    this.camera.position = new Vector2(
      10 * (1 + Math.cos(1.227 * t)),
      10 * (1 + Math.sin(2.865 * t))
    );
    this.camera.zoom = 1 + 0.2 * Math.sin(0.2112 * t);
    this.camera.angle = (Math.PI / 16) * Math.sin(0.33 * t);
    this.xform = this.camera.xform();

    for (let j = 0; j < 120; j++) {
      let [x_0, y_0] = [r, h];
      if (j % 2 === 1) {
        x_0 = r + dx / 2;
      }

      for (let i = 0; i <= 60; i++) {
        const h = ((i + j) / 15) % 1.0;
        const color = new ColorHsv(h, 1.0, 0.5).toRgb();
        const strokeColor = new Color(0, 0, 0);

        const p = new Vector2(x_0 + i * dx, y_0 + j * dy);
        this.drawHex(p, r, color, strokeColor);
      }
    }
  }

  renderLoop(): void {
    if (!this.ctx) {
      // Detached; quit rendering
      return;
    }
    this.render();
    window.requestAnimationFrame(() => this.renderLoop());
  }
}
