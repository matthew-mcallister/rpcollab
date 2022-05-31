import useMapContext from './hooks/useMapContext';

interface MapSettingsProps {}

export default function MapSettingsUi(props: MapSettingsProps) {
  const map = useMapContext().map;
  const [width, height] = [map.state.map.width, map.state.map.height];
  return (
    <div>
      <label>Width:</label>
      <input
        id="number"
        type="number"
        value={width}
        min={1}
        onChange={(e) => {
          map.state.map.resize(Number(e.target.value), height);
          map.invalidate();
        }}
      />
      <br />
      <label>Height:</label>
      <input
        id="number"
        type="number"
        value={height}
        min={1}
        onChange={(e) => {
          map.state.map.resize(width, Number(e.target.value));
          map.invalidate();
        }}
      />
    </div>
  );
}
