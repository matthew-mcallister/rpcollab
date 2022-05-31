import ColorPicker from '../../components/ColorPicker';
import Color from '../../math/Color';
import useMapContext from '../hooks/useMapContext';
import MapEditorState from '../State';
import Tool from './Tool';

export default class Paintbrush implements Tool {
  public radius = 1;
  public color = new Color(0.5, 0.5, 0.5);

  public apply(state: MapEditorState): void {
    const {highlightedCell} = state;
    if (highlightedCell) {
      highlightedCell.color = this.color;
    }
  }
}

interface PaintbrushUiProps {}

export function PaintbrushUi(props: PaintbrushUiProps) {
  const ctx = useMapContext();
  const paintbrush = ctx.map.state.toolbox.paintbrush;

  function changeColor(color: Color) {
    paintbrush.color = color;
    ctx.invalidate();
  }

  return (
    <div>
      <h3>Paintbrush</h3>
      <label>Color:</label>
      <ColorPicker color={paintbrush.color} onChange={changeColor} />
    </div>
  );
}
