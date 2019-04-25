import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";

export interface UpdateShapeAction extends AnyAction {
  index: number;
  shape: string;
}

const UPDATE_SHAPE = "updateShape";
function typeguard(action: AppAction): action is UpdateShapeAction {
  return (
    action.type === UPDATE_SHAPE &&
    action.hasOwnProperty("index") &&
    typeof (action as UpdateShapeAction).index === "number" &&
    action.hasOwnProperty("shape") &&
    typeof (action as UpdateShapeAction).shape === "string"
  );
}

function actionCreator(index: number, shape: string): UpdateShapeAction {
  return {
    type: UPDATE_SHAPE,
    index,
    shape
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  if (typeguard(action)) {
    const { index, shape } = action;
    return {
      ...state,
      operandShapes: [
        ...state.operandShapes.slice(0, index),
        shape,
        ...state.operandShapes.slice(index + 1)
      ]
    };
  } else {
    throw new TypeError(JSON.stringify({ reducer: UPDATE_SHAPE, action }));
  }
}

export default {
  type: UPDATE_SHAPE,
  typeguard,
  actionCreator,
  reducer
};
