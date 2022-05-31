import {useState} from 'react';
import {MapCommonProps} from './MapTab';
import MapEditorState from './State';

interface MapSettingsProps extends MapCommonProps {
  state: MapEditorState;
}

export default function MapSettingsUi(props: MapSettingsProps) {
  const [width, height] = [props.state.map.width, props.state.map.height];

  return (
    <div>
      <label>Width:</label>
      <input
        id="number"
        type="number"
        value={width}
        min={1}
        onChange={(e) => {
          props.state.map.resize(Number(e.target.value), height);
          props.invalidate();
        }}
      />
      <br />
      <label>Height:</label>
      <input
        id="number"
        type="number"
        value={props.state.map.height}
        min={1}
        onChange={(e) => {
          props.state.map.resize(width, Number(e.target.value));
          props.invalidate();
        }}
      />
    </div>
  );
}
