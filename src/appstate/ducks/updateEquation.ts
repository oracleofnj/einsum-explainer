import { validateAsJson } from "../../pkg/einsum";
import { isContractionSuccess } from "../../types/einsum_typeguards";
import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";

const UPDATE_EQUATION = "updateEquation";

export interface UpdateEquationAction extends AnyAction {
  equation: string;
}

const typeguard = (action: AppAction): action is UpdateEquationAction =>
  action.type === UPDATE_EQUATION &&
  action.hasOwnProperty("equation") &&
  typeof (action as UpdateEquationAction).equation === "string";

const actionCreator = (equation: string): UpdateEquationAction => ({
  type: UPDATE_EQUATION,
  equation
});

const reducer = (state: AppState, action: AppAction): AppState => {
  if (typeguard(action)) {
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
    throw new TypeError(JSON.stringify({ action }));
  }
};

export default {
  type: UPDATE_EQUATION,
  typeguard,
  actionCreator,
  reducer
};
