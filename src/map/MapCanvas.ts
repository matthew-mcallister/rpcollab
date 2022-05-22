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
    if (strokeColor && this.state.camera.zoom < 2.5) {
      this.ctx.stroke();
    }
  }

  /**
   * Computes a range of the grid to draw based on the current camera,
   * noticeably improving performance when zoomed in.
   *
   * Returns integer extends in the form [min, max]. If the camera is
   * completely off screen, max may be less than min.
   */
  cullingRange(): [Vector2, Vector2] {
    const [ul, lr] = this.state.cameraAabb();
    const dx = this.state.scale * (1 + Math.cos(Math.PI / 3));
    const dy = 2 * this.state.scale * Math.sin(Math.PI / 3);
    const min = new Vector2(
      Math.floor(ul.x / dx) - 1,
      Math.floor(ul.y / dy) - 2
    );
    const max = new Vector2(Math.ceil(lr.x / dx) + 1, Math.ceil(lr.y / dy) + 2);

    // We clamp to the map dimensions to avoid out-of-bounds access.
    // This doesn't clamp max if it is negative or min if it is larger
    // than the map dimensions.
    const [min_i, max_i] = [
      Math.max(min.x, 0),
      Math.min(max.x + 1, this.map.width),
    ];
    const [min_j, max_j] = [
      Math.max(min.y, 0),
      Math.min(max.y + 1, this.map.height),
    ];
    return [new Vector2(min_i, min_j), new Vector2(max_i, max_j)];
  }

  public drawGrid(): void {
    const r = this.state.scale;
    const h = 2 * r * Math.sin(Math.PI / 3);

    const dx = r * (1 + Math.cos(Math.PI / 3));
    const dy = h;

    const x_0 = r;
    const [min, max] = this.cullingRange();
    for (let j = min.x; j < max.x; j++) {
      const y_0 = j % 2 === 1 ? h : h / 2;
      for (let i = min.y; i < max.y; i++) {
        const p = new Vector2(x_0 + j * dx, y_0 + i * dy);
        const cell = this.map.cells[j][i];
        let color = cell.color;
        if (this.state.highlightedCell === cell) {
          color = color.lighten(0.2);
        }

        const strokeColor = new Color(0, 0, 0);
        this.drawHex(p, r, color, strokeColor);
      }
    }
  }

  public render(): void {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.xform = this.state.worldToCanvas();
    this.drawGrid();
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
