import {useState} from 'react';
import ColorPicker from '../../components/ColorPicker';
import Color from '../../math/Color';
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

interface PaintbrushUiProps {
  state: MapEditorState;
}

export function PaintbrushUi(props: PaintbrushUiProps) {
  const [dummy, setDummy] = useState(0);
  function triggerRender() {
    setDummy(dummy + 1);
  }

  const paintbrush = props.state.toolbox.paintbrush;

  function changeColor(color: Color) {
    paintbrush.color = color;
    triggerRender();
  }

  return (
    <div>
      <ColorPicker color={paintbrush.color} onChange={changeColor} />
    </div>
  );
}
