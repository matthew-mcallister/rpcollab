import {useState} from 'react';
import ColorPicker from '../../components/ColorPicker';
import Color from '../../math/Color';
import {MapCommonProps} from '../MapTab';
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

interface PaintbrushUiProps extends MapCommonProps {
  state: MapEditorState;
}

export function PaintbrushUi(props: PaintbrushUiProps) {
  const paintbrush = props.state.toolbox.paintbrush;

  function changeColor(color: Color) {
    paintbrush.color = color;
    props.invalidate('toolbox.paintbrush');
  }

  return (
    <div>
      <h3>Paintbrush</h3>
      <label>Color:</label>
      <ColorPicker color={paintbrush.color} onChange={changeColor} />
    </div>
  );
}
