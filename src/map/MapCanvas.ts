import Color from '../math/Color';
import {Vector2} from '../math/Vector';
import {Xform2} from '../math/Xform';
import {ControllerState, MapController} from './Controller';
import MapModel from './MapModel';

/**
 * Canvas-based controller which draws the map and processes interaction.
 * Should take any state as a parameter so it can be used in React
 * components.
 */
// TODO: Probably should rename something like MapCanvasView because
// it really only does drawing.
export default class MapCanvas {
  private map: MapModel;
  private ctx: CanvasRenderingContext2D | null = null;
  private state: ControllerState;
  private controller: MapController;

  // Memoized variable; not real state.
  private xform: Xform2;

  constructor(map: MapModel) {
    this.map = map;
    this.state = new ControllerState(map);
    this.controller = new MapController(this.state);
  }

  public attach(canvas: HTMLCanvasElement): void {
    this.ctx = canvas.getContext('2d');
    this.state.canvas = canvas;
    this.controller.attach(canvas);
  }

  public detach(): void {
    this.ctx = null;
    this.state.canvas = null;
    this.controller.detach();
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

  // For debugging
  private drawCursor() {
    let pos = this.xform.apply(this.state.cursorWorldPos);
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(pos.x - 6, pos.y - 6, 12, 12);
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

  public drawGrid(): void {
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

  public updateXform(): void {
    this.xform = this.state.worldToCanvas();
  }

  public render(): void {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.updateXform();
    this.drawGrid();
    this.drawCursor();
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
