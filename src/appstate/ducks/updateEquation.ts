import { validateAsJson } from "../../pkg/einsum";
import { isContraction, isErrorMessage } from "../../types/einsum_typeguards";
import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";
import parseAndTypecheckJSON from "../../utils/parseAndTypecheckJSON";

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
    let { visibleSizes } = state;

    const einsumExplanation = parseAndTypecheckJSON(
      validateAsJson(equation),
      isContraction,
      "validateAsJson"
    );
    if (!isErrorMessage(einsumExplanation)) {
      visibleSizes = einsumExplanation.Ok.operand_indices.length;
    }

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
