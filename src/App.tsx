import {useState} from 'react';
import './App.css';
import MapEditor from './map/MapEditor';
import MapModel from './map/MapModel';
import MapTabState from './map/MapTab';

function invalidate(obj: {[key: string]: any}, path: string) {
  for (const key of path.split('.')) {
    obj[key] = {...obj[key]};
    obj = obj[key];
  }
}

function App() {
  const [dummy, setDummy] = useState({});
  const [map, setMap] = useState(() => new MapTabState(new MapModel(100, 100)));

  function doInvalidate(path?: string) {
    setDummy({});
  }
  map.canvas.invalidate = doInvalidate;

  return (
    <div className="App">
      <MapEditor map={map} dummy={dummy} invalidate={doInvalidate} />
    </div>
  );
}

export default App;
