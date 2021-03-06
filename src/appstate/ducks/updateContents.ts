import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";
import { parseDataString } from "../../utils/parseDataString";
import { isErrorMessage, getShape } from "../../types/einsum_typeguards";

export interface UpdateContentsAction extends AnyAction {
  index: number;
  contents: string;
}

const UPDATE_CONTENTS = "updateContents";
function typeguard(action: AppAction): action is UpdateContentsAction {
  return (
    action.type === UPDATE_CONTENTS &&
    action.hasOwnProperty("index") &&
    typeof (action as UpdateContentsAction).index === "number" &&
    action.hasOwnProperty("contents") &&
    typeof (action as UpdateContentsAction).contents === "string"
  );
}

function actionCreator(index: number, contents: string): UpdateContentsAction {
  return {
    type: UPDATE_CONTENTS,
    index,
    contents
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  if (typeguard(action)) {
    const { index, contents } = action;
    const data = parseDataString(contents);
    const oldOperand = state.operandStates[index];
    let { shapeStr, contentsVector } = oldOperand;
    if (!isErrorMessage(data)) {
      const shape = getShape(data.Ok);
      if (isErrorMessage(shape)) {
        throw new Error("This shouldn't be possible");
      }
      shapeStr = JSON.stringify(shape.Ok)
        .replace(/\[/g, "(")
        .replace(/\]/g, ")");
      contentsVector = (data.Ok as number[]).flat(2 ** 16);
    }

    return {
      ...state,
      operandStates: [
        ...state.operandStates.slice(0, index),
        {
          ...oldOperand,
          shapeStr,
          contentsVector,
          contentsStr: contents
        },
        ...state.operandStates.slice(index + 1)
      ]
    };
  } else {
    throw new TypeError(JSON.stringify({ reducer: UPDATE_CONTENTS, action }));
  }
}

export default {
  type: UPDATE_CONTENTS,
  typeguard,
  actionCreator,
  reducer
};
