import Color, {ColorHsv} from '../math/Color';
import MapModel from './MapModel';

/**
 * Canvas-based controller which draws the map and processes interaction.
 * Should take any state as a parameter so it can be used in React
 * components.
 */
export default class MapCanvas {
  map: MapModel;
  ctx: CanvasRenderingContext2D | null = null;

  constructor(map: MapModel) {
    this.map = map;
  }

  attach(canvas: HTMLCanvasElement): void {
    this.ctx = canvas.getContext('2d');
  }

  detach(): void {
    this.ctx = null;
  }

  drawHex(
    x: number,
    y: number,
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
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + dx, y + dy);
    this.ctx.lineTo(x - dx, y + dy);
    this.ctx.lineTo(x - r, y);
    this.ctx.lineTo(x - dx, y - dy);
    this.ctx.lineTo(x + dx, y - dy);
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
    for (let j = 0; j < 120; j++) {
      let [x_0, y_0] = [r, h];
      if (j % 2 === 1) {
        x_0 = r + dx / 2;
      }
      x_0 += 10 * (1 + Math.cos(1.227 * t));
      y_0 += 10 * (1 + Math.sin(2.865 * t));
      for (let i = 0; i <= 60; i++) {
        const h = ((i + j) / 15) % 1.0;
        const color = new ColorHsv(h, 1.0, 0.5).toRgb();
        const strokeColor = new Color(0, 0, 0);

        const [x, y] = [x_0 + i * dx, y_0 + j * dy];
        this.drawHex(x, y, r, color, strokeColor);
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
