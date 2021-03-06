interface ToHexOptions {
  prefix?: boolean;
}

export default class Color {
  public readonly r: number;
  public readonly g: number;
  public readonly b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  public equals(other: Color): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b;
  }

  public toHex(options: ToHexOptions = {}): string {
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

  public static fromHex(hex: string): Color {
    if (hex.startsWith('#')) {
      hex = hex.slice(1);
    }
    if (hex.length == 3) {
      const [r, g, b] = [
        parseInt(hex[0], 16),
        parseInt(hex[1], 16),
        parseInt(hex[2], 16),
      ];
      return new Color(r / 15, g / 15, b / 15);
    } else {
      const [r, g, b] = [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
      return new Color(r / 255, g / 255, b / 255);
    }
  }

  public toHsv(): [number, number, number] {
    const [r, g, b] = [this.r, this.g, this.b];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const h =
      max === min
        ? 0
        : max === r
        ? (60 * ((g - b) / d)) % 360
        : max === g
        ? 60 * ((b - r) / d) + 120
        : max === b
        ? 60 * ((r - g) / d) + 240
        : 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return [h, s, v];
  }

  public lightness() {
    const max = Math.max(this.r, this.g, this.b);
    const min = Math.min(this.r, this.g, this.b);
    return (min + max) / 2;
  }

  public lighten(amount: number): Color {
    return new Color(
      this.r + amount * (1 - this.r),
      this.g + amount * (1 - this.g),
      this.b + amount * (1 - this.b)
    );
  }

  public darken(amount: number): Color {
    return new Color(
      this.r - amount * this.r,
      this.g - amount * this.g,
      this.b - amount * this.b
    );
  }
}

export class ColorHsv {
  public h: number;
  public s: number;
  public v: number;

  constructor(h: number, s: number, v: number) {
    this.h = h;
    this.s = s;
    this.v = v;
  }

  public toRgb(): Color {
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
