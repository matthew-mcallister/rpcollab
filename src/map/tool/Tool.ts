import MapEditorState from '../State';

export default interface Tool {
  apply(state: MapEditorState): void;
}
