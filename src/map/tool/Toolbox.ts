import Paintbrush from './Paintbrush';
import Tool from './Tool';

type ToolName = 'paintbrush';

export default class Toolbox {
  public selectedTool: ToolName = 'paintbrush';
  public paintbrush: Paintbrush = new Paintbrush();

  public currentTool(): Tool {
    return this[this.selectedTool];
  }
}
