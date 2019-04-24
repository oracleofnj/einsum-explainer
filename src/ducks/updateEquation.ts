import { validateAsJson } from "../pkg/einsum";
import { isContractionSuccess } from "../einsum_typeguards";

const UPDATE_EQUATION = "updateEquation";
function updateEquation(equation: string): UpdateEquationAction {
  return {
    type: UPDATE_EQUATION,
    equation
  };
}
function isUpdateEquationAction(
  action: AppAction
): action is UpdateEquationAction {
  return (
    action.type === UPDATE_EQUATION &&
    action.hasOwnProperty("equation") &&
    typeof (action as UpdateEquationAction).equation === "string"
  );
}
function updateEquationReducer(state: AppState, action: AppAction): AppState {
  if (isUpdateEquationAction(action)) {
    const { equation } = action;
    let anyEinsumExplanation: any = null;
    let { visibleSizes } = state;

    try {
      anyEinsumExplanation = JSON.parse(validateAsJson(equation));
      if (isContractionSuccess(anyEinsumExplanation)) {
        visibleSizes = anyEinsumExplanation.Ok.operand_indices.length;
      }
      // tslint:disable-next-line: no-empty
    } catch {}

    return {
      ...state,
      visibleSizes,
      equation: (action as UpdateEquationAction).equation
    };
  } else {
    throw new TypeError(JSON.stringify({ reducer: UPDATE_EQUATION, action }));
  }
}

export default {
  type: UPDATE_EQUATION,
  typeguard: isUpdateEquationAction,
  actionCreator: updateEquation,
  reducer: updateEquationReducer
};
