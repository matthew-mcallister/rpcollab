import {ControllerState} from '../Controller';
import Color from '../../math/Color';
import Tool from './Tool';

export default class Paintbrush implements Tool {
  public radius = 1;
  public color = new Color(0.5, 0.5, 0.5);

  public apply(state: ControllerState): void {
    const {highlightedCell} = state;
    if (highlightedCell) {
      highlightedCell.color = this.color;
    }
  }
}
