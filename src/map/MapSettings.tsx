import {useState} from 'react';
import useMapContext from './hooks/useMapContext';
import MapModel from './MapModel';

interface MapSettingsProps {}

export default function MapSettingsUi(props: MapSettingsProps) {
  const context = useMapContext();
  const map = context.map.state.map;
  const [width, height] = [map.width, map.height];

  const [file, setFile] = useState<Blob>(null);

  async function doImport() {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = async (e) => {
      const map = JSON.parse(e.target.result as string);
      Object.setPrototypeOf(map, MapModel);
      context.importMap(map);
    };
  }

  function doExport() {
    const text = JSON.stringify(map);
    const file = new Blob([text], {type: 'application/x-hexmap'});
    const url = URL.createObjectURL(file);
    window.open(url);
  }

  return (
    <div>
      <h3>Settings</h3>
      <label>Width:</label>
      <input
        id="number"
        type="number"
        className="Input"
        value={width}
        min={1}
        onChange={(e) => {
          map.resize(Number(e.target.value), height);
          context.invalidate();
        }}
      />
      <br />
      <label>Height:</label>
      <input
        id="number"
        type="number"
        className="Input"
        value={height}
        min={1}
        onChange={(e) => {
          map.resize(width, Number(e.target.value));
          context.invalidate();
        }}
      />
      <h4>Import/export</h4>
      <div style={{display: 'flex'}} className="Input">
        <input
          type="file"
          id="map-file"
          name="map-file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button id="import-button" onClick={doImport}>
          Import
        </button>
      </div>
      <button id="export-button" onClick={doExport}>
        Export
      </button>
    </div>
  );
}
