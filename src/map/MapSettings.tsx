import {useState} from 'react';
import MapEditorState from './State';

interface MapSettingsProps {
  state: MapEditorState;
}

export default function MapSettingsUi(props: MapSettingsProps) {
  const [width, height] = [props.state.map.width, props.state.map.height];

  const [dummy, setDummy] = useState(0);
  function render() {
    setDummy(dummy + 1);
  }

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
          render();
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
          render();
        }}
      />
    </div>
  );
}
