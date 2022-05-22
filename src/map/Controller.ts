import {Camera} from '../math/Camera';
import {Vector2} from '../math/Vector';
import {Xform2} from '../math/Xform';
import MapModel from './MapModel';

/**
 * This represents the main state of the map canvas controller. Multiple
 * sub-controllers hold internal bits of state for themselves, but they
 * mutate this state object to communicate with each other and control
 * rendering and interaction.
 */
export class ControllerState {
  // Inputs to the controllers
  public readonly map: MapModel;
  public canvas: HTMLCanvasElement | null = null;

  // Actual state
  public camera = new Camera();
  public cursorWorldPos = new Vector2();

  constructor(map: MapModel) {
    this.map = map;
  }

  /**
   * Computes the transform fron camera space to canvas space.
   *
   * Unlike in 3D, there is no perspective transform and no clip space.
   * We need only apply a DPI scaling factor and an offset so the camera
   * is centered on the middle of the viewport.
   */
  public canvasXform(): Xform2 {
    const canvas = this.canvas;
    const offset = new Vector2(canvas.width / 2, canvas.height / 2);
    return new Xform2(offset, window.devicePixelRatio);
  }

  /**
   * Transform from world coordinates to screen coordinates via the
   * current cameea.
   */
  public worldToCanvas(): Xform2 {
    const camera = this.camera.xform();
    const canvas = this.canvasXform();
    return canvas.mul(camera);
  }

  /** Inverse transformation of worldToCanvas(). */
  public canvasToWorld(): Xform2 {
    return this.worldToCanvas().inv();
  }
}

/**
 * This is the base class for other controllers.
 */
export class Controller {
  public state: ControllerState;

  constructor(state: ControllerState) {
    this.state = state;
  }

  public onMouseDown(e: MouseEvent): void {}
  public onMouseUp(e: MouseEvent): void {}
  public onMouseMove(e: MouseEvent): void {}
  public onWheel(event: WheelEvent): void {}
}

class CameraController extends Controller {
  public dragging: boolean = false;

  constructor(state: ControllerState) {
    super(state);
  }

  /** Factor to convert mouse position to screen position. */
  zoomFactor(): number {
    return (2 * window.devicePixelRatio) / this.state.camera.zoom;
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
    // TODO: Probably shouldn't use FP math for this.
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
  constructor(state: ControllerState) {
    super(state);
  }

  public onMouseMove(event: MouseEvent): void {
    const pos = new Vector2(event.offsetX, event.offsetY);
    this.state.cursorWorldPos = this.state.canvasToWorld().apply(pos);
  }
}

export class MapController {
  public cameraController: CameraController;
  public cursorController: CursorController;

  constructor(state: ControllerState) {
    this.cameraController = new CameraController(state);
    this.cursorController = new CursorController(state);
  }

  public controllers(): Controller[] {
    return [this.cameraController, this.cursorController];
  }

  public attach(canvas: HTMLCanvasElement): void {
    const controller = this;

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

    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mouseup', mouseup);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('wheel', wheel);

    controller.detach = () => {
      canvas.removeEventListener('mousedown', mousedown);
      canvas.removeEventListener('mouseup', mouseup);
      canvas.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('wheel', wheel);
      controller.detach = () => {};
    };
  }

  public detach(): void {}
}
