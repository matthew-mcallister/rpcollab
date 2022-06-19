import './App.css';

import {useState} from 'react';
import {MapContext} from './map/hooks/useMapContext';
import MapCanvas from './map/MapCanvas';
import MapEditor from './map/MapEditor';
import MapModel from './map/MapModel';
import MapEditorState from './map/State';

function App() {
  const [dummy, setDummy] = useState({});
  const [map, _] = useState(() => {
    const model = new MapModel(100, 100);
    const state = new MapEditorState(model);
    return new MapCanvas(state);
  });

  function importMap(newMap: any) {
    map.map.deserialize(newMap);
  }

  function invalidate(path?: string) {
    setDummy({});
  }
  map.invalidate = invalidate;

  return (
    <div className="App">
      <MapContext.Provider value={{map, importMap, invalidate}}>
        <MapEditor />
      </MapContext.Provider>
    </div>
  );
}

export default App;
