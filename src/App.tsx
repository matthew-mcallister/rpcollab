import {useRef, useState} from 'react';
import './App.css';
import MapCanvas from './map/MapCanvas';
import MapModel from './map/MapModel';
import MapView from './map/MapView';
import MapEditorState from './map/State';
import {PaintbrushUi} from './map/tool/Paintbrush';

function App() {
  const [map, setMap] = useState(() => new MapModel(100, 100));
  const mapEditorState = useRef(new MapEditorState(map));
  const [mapCanvas, setMapCanvas] = useState(
    () => new MapCanvas(mapEditorState.current)
  );

  return (
    <div className="App">
      <div className="map-area">
        <MapView mapCanvas={mapCanvas} />
      </div>
      <div className="sidebar">
        <PaintbrushUi state={mapEditorState.current} />
      </div>
    </div>
  );
}

export default App;
