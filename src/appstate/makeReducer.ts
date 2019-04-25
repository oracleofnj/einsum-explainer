import { AppState, AppAction } from "./appState";

export interface AnyAction {
  type: string;
}

export type Reducer = (state: AppState, action: AppAction) => AppState;
export type ActionCreator = (...args: any[]) => AppAction;
export type ActionTypeGuard = (action: AppAction) => boolean;
export type Duck = {
  type: string;
  typeguard: ActionTypeGuard;
  actionCreator: ActionCreator;
  reducer: Reducer;
};

export default function makeReducer(ducks: Duck[]): Reducer {
  const appReducers: { [key: string]: Reducer } = {};

  ducks.forEach(duck => {
    if (appReducers[duck.type]) {
      throw new Error(`Multiple declarations for ${duck.type}`);
    } else {
      appReducers[duck.type] = duck.reducer;
    }
  });

  return (state: AppState, action: AppAction): AppState =>
    appReducers[action.type](state, action);
}
