import Two from 'two.js';
import MapModel from './MapModel';

export default class SvgRenderer {
  public readonly map: MapModel;

  constructor(map: MapModel) {
    this.map = map;
  }

  public render(): Blob {
    const target = document.createElement('div');
    const two = new Two({
      type: Two.Types.svg,
      fullscreen: true,
    }).appendTo(target);

    const rect = two.makeRectangle(two.width / 2, two.height / 2, 50, 50);
    rect.fill = 'rgb(234, 60, 50)';
    rect.linewidth = 10;

    two.render();
    let text = target.innerHTML;
    text = text.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

    const blob = new Blob([text], {
      type: 'image/svg+xml;charset=utf-8',
    });
    target.remove();
    return blob;
  }
}
