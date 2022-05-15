import {ColorHsv} from '../math/Color';
import MapModel from './MapModel';

/**
 * Canvas-based controller which draws the map and processes interaction.
 * Should take any state as a parameter so it can be used in React
 * components.
 */
export default class MapCanvas {
  map: MapModel;
  canvas: HTMLCanvasElement | null = null;

  constructor(map: MapModel) {
    this.map = map;
  }

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  detach() {
    this.canvas = null;
  }

  render(): void {
    const ctx = this.canvas.getContext('2d');
    const t = performance.now() / 1000.0;
    const h = (t / 12.0) % 1.0;
    ctx.fillStyle = '#' + new ColorHsv(h, 1.0, 0.5).toRgb().toHex();
    console.log(ctx.fillStyle);
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderLoop(): void {
    if (!this.canvas) {
      // Detached; quit rendering
      return;
    }
    this.render();
    window.requestAnimationFrame(() => this.renderLoop());
  }
}
