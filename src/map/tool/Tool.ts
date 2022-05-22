import {ControllerState} from '../Controller';

export default interface Tool {
  apply(state: ControllerState): void;
}
