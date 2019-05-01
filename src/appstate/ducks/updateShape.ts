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

function getContents(v: number[], shape: number[]) {
  let totalLength = 1;
  for (const s of shape) {
    totalLength *= s;
  }
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
    const oldOperand = state.operandStates[index];
    const { contentsVector } = oldOperand;
    let { contentsStr } = oldOperand;
    if (!isErrorMessage(data)) {
      const newNDArray = parseOutput({
        shape: data.Ok,
        contents: getContents(contentsVector, data.Ok)
      });
      contentsStr = JSON.stringify(newNDArray);
    }

    return {
      ...state,
      operandStates: [
        ...state.operandStates.slice(0, index),
        {
          ...oldOperand,
          shapeStr: shape,
          contentsStr,
          contentsVector
        },
        ...state.operandStates.slice(index + 1)
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
