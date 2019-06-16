import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";

const UPDATE_OPTIMIZATION_METHOD = "updateOptimizationMethod";

export interface UpdateOptimizationMethod extends AnyAction {
  optimizationMethod: string;
}

const typeguard = (action: AppAction): action is UpdateOptimizationMethod =>
  action.type === UPDATE_OPTIMIZATION_METHOD &&
  action.hasOwnProperty("optimizationMethod") &&
  typeof (action as UpdateOptimizationMethod).optimizationMethod === "string";

const actionCreator = (optimizationMethod: string): UpdateOptimizationMethod => ({
  type: UPDATE_OPTIMIZATION_METHOD,
  optimizationMethod
});

const reducer = (state: AppState, action: AppAction): AppState => {
  if (typeguard(action)) {
    const { optimizationMethod } = action;

    return {
      ...state,
      optimizationMethod
    };
  } else {
    throw new TypeError(JSON.stringify({ action }));
  }
};

export default {
  type: UPDATE_OPTIMIZATION_METHOD,
  typeguard,
  actionCreator,
  reducer
};
