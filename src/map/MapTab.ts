import MapCanvas from './MapCanvas';
import MapModel from './MapModel';
import MapEditorState from './State';

export default class MapTabState {
  public map: MapModel;
  public state: MapEditorState;
  public canvas: MapCanvas;

  constructor(map: MapModel) {
    this.map = map;
    this.state = new MapEditorState(map);
    this.canvas = new MapCanvas(this.state);
  }
}

export interface MapCommonProps {
  dummy: {};
  invalidate: (path?: string) => void;
}
