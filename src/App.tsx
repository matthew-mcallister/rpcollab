import {useState} from 'react';
import './App.css';
import MapEditor from './map/MapEditor';
import MapModel from './map/MapModel';
import MapTabState from './map/MapTab';

function App() {
  const [map, setMap] = useState(() => new MapTabState(new MapModel(100, 100)));

  return (
    <div className="App">
      <MapEditor map={map} />
    </div>
  );
}

export default App;
