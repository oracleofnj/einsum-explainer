interface AnyAction {
  type: string;
}

type Reducer = (state: AppState, action: AppAction) => AppState;
type ActionCreator = (...args: any[]) => AppAction;
type ActionTypeGuard = (action: AppAction) => boolean;
type Duck = {
  type: string;
  typeguard: ActionTypeGuard;
  actionCreator: ActionCreator;
  reducer: Reducer;
};
