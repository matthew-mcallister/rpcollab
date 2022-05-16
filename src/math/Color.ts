interface ToHexOptions {
  prefix?: boolean;
}

export default class Color {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toHex(options: ToHexOptions = {}): string {
    const [r, g, b] = [
      Math.floor(this.r * 255),
      Math.floor(this.g * 255),
      Math.floor(this.b * 255),
    ];
    const [rs, gs, bs] = [
      r.toString(16).padStart(2, '0'),
      g.toString(16).padStart(2, '0'),
      b.toString(16).padStart(2, '0'),
    ];
    if (options.prefix) {
      return `#${rs}${gs}${bs}`;
    } else {
      return `${rs}${gs}${bs}`;
    }
  }
}

export class ColorHsv {
  h: number;
  s: number;
  v: number;

  constructor(h: number, s: number, v: number) {
    this.h = h;
    this.s = s;
    this.v = v;
  }

  toRgb(): Color {
    let r: number = 0;
    let g: number = 0;
    let b: number = 0;

    const i: number = Math.floor(this.h * 6);
    const f: number = this.h * 6 - i;
    const p: number = this.v * (1 - this.s);
    const q: number = this.v * (1 - f * this.s);
    const t: number = this.v * (1 - (1 - f) * this.s);

    switch (i % 6) {
      case 0:
        [r, g, b] = [this.v, t, p];
        break;
      case 1:
        [r, g, b] = [q, this.v, p];
        break;
      case 2:
        [r, g, b] = [p, this.v, t];
        break;
      case 3:
        [r, g, b] = [p, q, this.v];
        break;
      case 4:
        [r, g, b] = [t, p, this.v];
        break;
      case 5:
        [r, g, b] = [this.v, p, q];
        break;
    }

    return new Color(r, g, b);
  }
}
