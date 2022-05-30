import MapTabState from './MapTab';
import MapView from './MapView';
import Sidebar from './Sidebar';

interface MapEditorProps {
  map: MapTabState;
}

export default function MapEditor(props: MapEditorProps) {
  return (
    <>
      <div className="map-area">
        <MapView mapCanvas={props.map.canvas} />
      </div>
      <div className="SideBar">
        <Sidebar tabState={props.map} />
      </div>
    </>
  );
}
