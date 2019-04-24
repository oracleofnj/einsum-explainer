const UPDATE_SHAPE = "updateShape";
function isUpdateShapeAction(action: AppAction): action is UpdateShapeAction {
  return (
    action.type === UPDATE_SHAPE &&
    action.hasOwnProperty("index") &&
    typeof (action as UpdateShapeAction).index === "number" &&
    action.hasOwnProperty("shape") &&
    typeof (action as UpdateShapeAction).shape === "string"
  );
}
function updateShapeReducer(state: AppState, action: AppAction): AppState {
  if (isUpdateShapeAction(action)) {
    const { index, shape } = action;
    return {
      ...state,
      operandShapes: [
        ...state.operandShapes.slice(0, index),
        shape,
        ...state.operandShapes.slice(index + 1)
      ]
    };
  } else {
    throw new TypeError(JSON.stringify({ reducer: UPDATE_SHAPE, action }));
  }
}
function updateShape(index: number, shape: string): UpdateShapeAction {
  return {
    type: UPDATE_SHAPE,
    index,
    shape
  };
}

export default {
  type: UPDATE_SHAPE,
  typeguard: isUpdateShapeAction,
  actionCreator: updateShape,
  reducer: updateShapeReducer
};
