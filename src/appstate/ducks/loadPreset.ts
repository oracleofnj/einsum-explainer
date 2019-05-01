import { AppState, AppAction } from "../appState";
import { AnyAction } from "../makeReducer";
import presets, { getState } from "../presets";

const LOAD_PRESET = "loadPreset";

export interface LoadPresetAction extends AnyAction {
  preset: string;
}

const typeguard = (action: AppAction): action is LoadPresetAction =>
  action.type === LOAD_PRESET &&
  typeof (action as LoadPresetAction).preset === "string" &&
  presets.hasOwnProperty((action as LoadPresetAction).preset);

const actionCreator = (preset: string): LoadPresetAction => ({
  type: LOAD_PRESET,
  preset
});

const reducer = (state: AppState, action: AppAction): AppState => {
  if (typeguard(action)) {
    return getState(presets[action.preset]);
  } else {
    throw new TypeError(JSON.stringify({ action }));
  }
};

export default {
  type: LOAD_PRESET,
  typeguard,
  actionCreator,
  reducer
};
