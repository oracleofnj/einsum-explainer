import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";

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
    return {
      ...state,
      operandContents: [
        ...state.operandContents.slice(0, index),
        contents,
        ...state.operandContents.slice(index + 1)
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
