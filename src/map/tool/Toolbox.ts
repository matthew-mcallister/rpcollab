import Paintbrush from './Paintbrush';
import PaintBucket from './PaintBucket';
import Tool from './Tool';

export type ToolName = 'paintbrush' | 'paintBucket';

export default class Toolbox {
  public selectedTool: ToolName = 'paintbrush';
  public paintbrush: Paintbrush = new Paintbrush();
  public paintBucket: PaintBucket = new PaintBucket();

  public currentTool(): Tool {
    return this[this.selectedTool];
  }
}
