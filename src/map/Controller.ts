import {Vector2} from '../math/Vector';
import MapEditorState from './State';

/**
 * This is the base class for other controllers.
 */
export class Controller {
  public state: MapEditorState;

  constructor(state: MapEditorState) {
    this.state = state;
  }

  public onMouseEnter(e: MouseEvent): void {}
  public onMouseLeave(e: MouseEvent): void {}
  public onMouseDown(e: MouseEvent): void {}
  public onMouseUp(e: MouseEvent): void {}
  public onMouseMove(e: MouseEvent): void {}
  public onWheel(e: WheelEvent): void {}
}

class CameraController extends Controller {
  public dragging: boolean = false;

  constructor(state: MapEditorState) {
    super(state);
  }

  /** Factor to convert mouse position to screen position. */
  zoomFactor(): number {
    return (2 * window.devicePixelRatio) / this.state.camera.zoom;
  }

  public onMouseLeave(event: MouseEvent): void {
    this.dragging = false;
  }

  public onMouseDown(event: MouseEvent): void {
    if (event.button === 1 || (event.button === 0 && event.shiftKey)) {
      this.dragging = true;
    }
  }

  public onMouseUp(event: MouseEvent): void {
    if (event.button === 0 || event.button === 1) {
      this.dragging = false;
    }
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      // TODO: IDK what the exact formula is but this works for me
      this.state.camera.position.x -= event.movementX / this.zoomFactor();
      this.state.camera.position.y -= event.movementY / this.zoomFactor();
    }
    // TODO: Preserve momentum when releasing
  }

  public onWheel(event: WheelEvent): void {
    // TODO: This sucks on trackpad.
    if (event.deltaY < 0) {
      this.state.camera.zoom *= (16 - 1) / 16;
    } else {
      this.state.camera.zoom *= (16 + 1) / 16;
    }
  }
}

/**
 * This class manages how the cursor interacts with the map and objects
 * in it.
 */
class CursorController extends Controller {
  clicking: boolean;

  constructor(state: MapEditorState) {
    super(state);
  }

  private applyTool() {
    if (this.clicking) {
      this.state.toolbox.currentTool().apply(this.state);
    }
  }

  public onMouseDown(e: MouseEvent): void {
    if (e.button === 0) {
      this.clicking = true;
    }
    this.applyTool();
  }

  public onMouseUp(e: MouseEvent): void {
    if (e.button === 0) {
      this.clicking = false;
    }
  }

  public onMouseLeave(e: MouseEvent): void {
    this.clicking = false;
  }

  public onMouseMove(event: MouseEvent): void {
    const pos = new Vector2(event.offsetX, event.offsetY);
    this.state.cursorWorldPos = this.state.canvasToWorld().apply(pos);
    this.state.highlightedCell = this.state.map.cellAtPosition(
      this.state.cursorWorldPos.mul(1 / this.state.scale)
    );
    this.applyTool();
  }
}

export class MapController {
  public cameraController: CameraController;
  public cursorController: CursorController;

  constructor(state: MapEditorState) {
    this.cameraController = new CameraController(state);
    this.cursorController = new CursorController(state);
  }

  public controllers(): Controller[] {
    return [this.cameraController, this.cursorController];
  }

  public attach(canvas: HTMLCanvasElement): void {
    const controller = this;

    function mouseenter(event: MouseEvent): void {
      for (const cnt of controller.controllers()) {
        cnt.onMouseEnter(event);
      }
    }
    function mouseleave(event: MouseEvent): void {
      for (const cnt of controller.controllers()) {
        cnt.onMouseLeave(event);
      }
    }
    function mousedown(event: MouseEvent) {
      for (const cnt of controller.controllers()) {
        cnt.onMouseDown(event);
      }
    }
    function mouseup(event: MouseEvent) {
      for (const cnt of controller.controllers()) {
        cnt.onMouseUp(event);
      }
    }
    function mousemove(event: MouseEvent) {
      for (const cnt of controller.controllers()) {
        cnt.onMouseMove(event);
      }
    }
    function wheel(event: WheelEvent) {
      for (const cnt of controller.controllers()) {
        cnt.onWheel(event);
      }
    }

    canvas.addEventListener('mouseenter', mouseenter);
    canvas.addEventListener('mouseleave', mouseleave);
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mouseup', mouseup);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('wheel', wheel);

    controller.detach = () => {
      canvas.removeEventListener('mouseenter', mouseenter);
      canvas.removeEventListener('mouseleave', mouseleave);
      canvas.removeEventListener('mousedown', mousedown);
      canvas.removeEventListener('mouseup', mouseup);
      canvas.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('wheel', wheel);
      controller.detach = () => {};
    };
  }

  public detach(): void {}
}
