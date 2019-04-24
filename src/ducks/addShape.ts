import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";

const ADD_SHAPE = "addShape";

// tslint:disable-next-line: no-empty-interface
export interface AddShapeAction extends AnyAction {}

const typeguard = (action: AppAction): action is AddShapeAction => action.type === ADD_SHAPE;

const actionCreator = (): AddShapeAction => ({
  type: ADD_SHAPE
});

const reducer = (state: AppState, action: AppAction): AppState => {
  if (typeguard(action)) {
    return {
      ...state,
      visibleSizes: state.visibleSizes + 1
    };
  } else {
    throw new TypeError(JSON.stringify({ action }));
  }
};

export default {
  type: ADD_SHAPE,
  typeguard,
  actionCreator,
  reducer
};
