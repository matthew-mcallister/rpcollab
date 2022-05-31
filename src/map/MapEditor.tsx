import './MapEditor.css';

import MapView from './MapView';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MapEditorProps {}

/**
 * This is a wrapper around the subcomponents that make up the map
 * editor tab. It provides the layout of the UI.
 */
export default function MapEditor(props: MapEditorProps) {
  return (
    <div className="MapEditor">
      <div className="MapViewContainer">
        <MapView />
      </div>
      <div className="SidebarContainer">
        <Sidebar />
      </div>
      <div className="FooterContainer">
        <Footer />
      </div>
    </div>
  );
}
