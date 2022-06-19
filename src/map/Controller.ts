import {Vector2} from '../math/Vector';
import MapEditorState from './State';

/**
 * Provides an extra layer of indirection to decouple JS event system
 * from application-level event logic.
 */
class EventHandler {
  state: MapEditorState;

  constructor(state: MapEditorState) {
    this.state = state;
  }

  onPanning(delta: Vector2): void {
    // TODO: Preserve momentum when releasing?
    const camera = this.state.camera;
    camera.position = camera.position.sub(delta.mul(camera.zoom));
  }

  // TODO: This sucks on trackpad.
  onZooming(delta: number): void {
    if (delta < 0) {
      this.state.camera.zoom *= (16 - 1) / 16;
    } else {
      this.state.camera.zoom *= (16 + 1) / 16;
    }
  }

  onDragging(pos: Vector2): void {
    this.state.cursorWorldPos = this.state.canvasToWorld().apply(pos);
    const p = this.state.cursorWorldPos.mul(1 / this.state.scale);
    this.state.highlightedCell = this.state.map.cellAtPosition(p);
    this.state.toolbox.currentTool().apply(this.state);
  }
}

/**
 * This is the base class for other controllers.
 */
export class Controller {
  handler: EventHandler;

  constructor(handler: EventHandler) {
    this.handler = handler;
  }

  public onMouseEnter(e: MouseEvent): void {}
  public onMouseLeave(e: MouseEvent): void {}
  public onMouseDown(e: MouseEvent): void {}
  public onMouseUp(e: MouseEvent): void {}
  public onMouseMove(e: MouseEvent): void {}
  public onWheel(e: WheelEvent): void {}
}

// TODO: Combine this with cursor controller
class CameraController extends Controller {
  // TODO: Not sure if this variable is needed since events include the
  // current button state
  public dragging: boolean = false;

  constructor(handler: EventHandler) {
    super(handler);
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
      const ratio = 2 * window.devicePixelRatio;
      const [dx, dy] = [event.movementX / ratio, event.movementY / ratio];
      this.handler.onPanning(new Vector2(dx, dy));
    }
  }

  public onWheel(event: WheelEvent): void {
    this.handler.onZooming(event.deltaY);
  }
}

class CursorController extends Controller {
  // TODO: Not sure if this variable is needed since events include the
  // current button state
  clicking: boolean;

  constructor(handler: EventHandler) {
    super(handler);
  }

  private applyTool(event: MouseEvent) {
    if (this.clicking && !event.shiftKey) {
      const pos = new Vector2(event.offsetX, event.offsetY);
      this.handler.onDragging(pos);
    }
  }

  public onMouseDown(e: MouseEvent): void {
    if (e.button === 0) {
      this.clicking = true;
    }
    this.applyTool(e);
  }

  public onMouseUp(e: MouseEvent): void {
    if (e.button === 0) {
      this.clicking = false;
    }
  }

  public onMouseLeave(e: MouseEvent): void {
    this.clicking = false;
  }

  public onMouseMove(e: MouseEvent): void {
    this.applyTool(e);
  }
}

export class MapController {
  public cameraController: CameraController;
  public cursorController: CursorController;

  constructor(state: MapEditorState) {
    const handler = new EventHandler(state);
    this.cameraController = new CameraController(handler);
    this.cursorController = new CursorController(handler);
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
