import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";
import { parseShapeString } from "../../utils/parseShapeStrings";
import { isErrorMessage } from "../../types/einsum_typeguards";
import parseOutput from "../../utils/parseOutputString";

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

function getContents(operandVectors: number[][], index: number, shape: number[]) {
  let totalLength = 1;
  for (const s of shape) {
    totalLength *= s;
  }
  const v = operandVectors[index];
  if (!(v instanceof Array)) {
    return Array(totalLength).fill(0);
  }
  const ret = [];
  for (let i = 0; i < totalLength; i++) {
    if (typeof v[i] !== "number") {
      ret.push(0);
    } else {
      ret.push(v[i]);
    }
  }
  return ret;
}

function reducer(state: AppState, action: AppAction): AppState {
  if (typeguard(action)) {
    const { index, shape } = action;
    const data = parseShapeString(shape);
    if (isErrorMessage(data)) {
      return {
        ...state,
        operandShapes: [
          ...state.operandShapes.slice(0, index),
          shape,
          ...state.operandShapes.slice(index + 1)
        ]
      };
    } else {
      const newContents = getContents(state.operandVectors, index, data.Ok);
      const newNDArray = parseOutput({
        shape: data.Ok,
        contents: newContents
      });

      return {
        ...state,
        operandContents: [
          ...state.operandContents.slice(0, index),
          JSON.stringify(newNDArray),
          ...state.operandContents.slice(index + 1)
        ],
        operandShapes: [
          ...state.operandShapes.slice(0, index),
          shape,
          ...state.operandShapes.slice(index + 1)
        ]
      };
    }
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
