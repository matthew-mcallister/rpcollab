import Two from 'two.js';
import Color from '../math/Color';
import {Vector2} from '../math/Vector';
import MapModel from './MapModel';

class SvgRenderer {
  readonly map: MapModel;
  readonly target: HTMLDivElement;
  readonly two: Two;
  readonly r = 10;

  constructor(map: MapModel) {
    this.map = map;
    this.target = document.createElement('div');
    this.two = new Two({
      type: Two.Types.svg,
      fullscreen: true,
    }).appendTo(this.target);
  }

  drawHex(p: Vector2, fill: Color, stroke?: Color): void {
    const poly = this.two.makePolygon(p.x, p.y, this.r, 6);
    poly.fill = fill.toHex({prefix: true});
    if (stroke) {
      poly.stroke = stroke.toHex({prefix: true});
      poly.linewidth = this.r * 0.05;
    }
  }

  drawMap(): void {
    const r = this.r;
    const h = 2 * r * Math.sin(Math.PI / 3);

    const dx = r * (1 + Math.cos(Math.PI / 3));
    const dy = h;

    const x_0 = r;
    for (let j = 0; j < this.map.width; j++) {
      const y_0 = j % 2 === 1 ? h : h / 2;
      for (let i = 0; i < this.map.height; i++) {
        const p = new Vector2(x_0 + j * dx, y_0 + i * dy);
        const cell = this.map.cells[j][i];
        const fill = cell.color;
        const stroke = new Color(0, 0, 0);
        this.drawHex(p, fill, stroke);
      }
    }

    this.two.renderer.setSize(r * 2 * this.map.width, h * this.map.height);
  }

  render(): string {
    this.drawMap();
    this.two.render();
    let text = this.target.innerHTML;
    text = text.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    this.target.remove();
    return text;
  }
}

export default function render_svg(map: MapModel): string {
  const renderer = new SvgRenderer(map);
  return renderer.render();
}
