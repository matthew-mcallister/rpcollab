import ColorPicker from '../../components/ColorPicker';
import Color from '../../math/Color';
import useMapContext from '../hooks/useMapContext';
import {Cell} from '../MapModel';
import MapEditorState from '../State';
import Tool from './Tool';

type Mode = 'flood' | 'global';

export default class PaintBucket implements Tool {
  public color = new Color(0.5, 0.5, 0.5);
  public mode: Mode = 'flood';

  public apply(state: MapEditorState): void {
    if (!state.highlightedCell) {
      return;
    }
    const oldColor = state.highlightedCell.color;
    if (oldColor === this.color) {
      return;
    }

    switch (this.mode) {
      case 'flood':
        this.floodFill(state);
        break;
      case 'global':
        this.globalReplace(state);
        break;
    }
  }

  private floodFill(state: MapEditorState) {
    const {map, highlightedCell} = state;

    const oldColor = highlightedCell.color;
    const work = new Set<Cell | undefined>();
    work.add(highlightedCell);

    while (work.size > 0) {
      const {value} = work.entries().next();
      const cell: Cell | undefined = value[0];
      work.delete(cell);

      if (cell === undefined) {
        continue;
      }

      if (cell.color.equals(oldColor)) {
        cell.color = this.color;

        const {x, y} = cell;
        if (x % 2 === 0) {
          work.add(map.get(x - 1, y - 1));
          work.add(map.get(x + 0, y - 1));
          work.add(map.get(x + 1, y - 1));

          work.add(map.get(x - 1, y));
          work.add(map.get(x + 1, y));

          work.add(map.get(x + 0, y + 1));
        } else {
          work.add(map.get(x + 0, y - 1));

          work.add(map.get(x - 1, y));
          work.add(map.get(x + 1, y));

          work.add(map.get(x - 1, y + 1));
          work.add(map.get(x + 0, y + 1));
          work.add(map.get(x + 1, y + 1));
        }
      }
    }
  }

  public globalReplace(state: MapEditorState): void {
    const {map, highlightedCell} = state;
    const oldColor = highlightedCell.color;
    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.height; y++) {
        const cell = map.get(x, y);
        if (cell.color.equals(oldColor)) {
          cell.color = this.color;
        }
      }
    }
  }
}

interface PaintBucketUiProps {}

export function PaintBucketUi(props: PaintBucketUiProps) {
  const ctx = useMapContext();
  const paintBucket = ctx.map.state.toolbox.paintBucket;

  function changeColor(color: Color) {
    paintBucket.color = color;
    ctx.invalidate();
  }

  function changeMode(mode: Mode) {
    paintBucket.mode = mode;
    ctx.invalidate();
  }

  return (
    <div>
      <h3>Paint Bucket</h3>
      <div>
        <label>Color:</label>
        <ColorPicker
          className="Input"
          color={paintBucket.color}
          onChange={changeColor}
        />
      </div>
      <div>
        <label>Mode:</label>
        <input
          id="mode-flood"
          type="radio"
          name="mode"
          value="flood"
          checked={paintBucket.mode === 'flood'}
          onChange={(e) => changeMode(e.target.value as Mode)}
        />
        <label htmlFor="mode-flood">Flood fill</label>
        <input
          id="mode-global"
          type="radio"
          name="mode"
          value="global"
          checked={paintBucket.mode === 'global'}
          onChange={(e) => changeMode(e.target.value as Mode)}
        />
        <label htmlFor="mode-global">Global replace</label>
      </div>
    </div>
  );
}
