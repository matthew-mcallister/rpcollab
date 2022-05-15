import {useState} from 'react';
import './App.css';
import MapCanvas from './map/MapCanvas';
import MapView from './map/MapView';

function App() {
  const [map, setMap] = useState(() => new Map());
  const [mapCanvas, setMapCanvas] = useState(() => new MapCanvas(map));

  return (
    <div className="App">
      <MapView mapCanvas={mapCanvas} />
    </div>
  );
}

export default App;
