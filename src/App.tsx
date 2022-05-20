import {useState} from 'react';
import './App.css';
import MapCanvas from './map/MapCanvas';
import MapModel from './map/MapModel';
import MapView from './map/MapView';
import {ColorHsv} from './math/Color';

function buildMap(): MapModel {
  const map = new MapModel(100, 100);

  for (let i = 0; i < map.width; i++) {
    for (let j = 0; j < map.height; j++) {
      const hue = ((i + j) / 15) % 1.0;
      map.cells[i][j].color = new ColorHsv(hue, 1.0, 0.5).toRgb();
    }
  }

  return map;
}

function App() {
  const [map, setMap] = useState(() => buildMap());
  const [mapCanvas, setMapCanvas] = useState(() => new MapCanvas(map));

  return (
    <div className="App">
      <MapView mapCanvas={mapCanvas} />
    </div>
  );
}

export default App;
