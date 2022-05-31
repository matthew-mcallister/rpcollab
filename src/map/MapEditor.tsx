import './MapEditor.css';

import MapTabState, {MapCommonProps} from './MapTab';
import MapView from './MapView';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MapEditorProps extends MapCommonProps {
  map: MapTabState;
}

/**
 * This is a wrapper around the subcomponents that make up the map
 * editor tab. It provides the layout of the UI.
 */
export default function MapEditor(props: MapEditorProps) {
  return (
    <div className="MapEditor">
      <div className="MapViewContainer">
        <MapView mapCanvas={props.map.canvas} />
      </div>
      <div className="SidebarContainer">
        <Sidebar tabState={props.map} {...props} />
      </div>
      <div className="FooterContainer">
        <Footer state={props.map} />
      </div>
    </div>
  );
}
