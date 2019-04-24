type AppState = {
  equation: string;
  visibleSizes: number;
  operandShapes: string[];
};

interface UpdateEquationAction extends AnyAction {
  equation: string;
}

interface UpdateShapeAction extends AnyAction {
  index: number;
  shape: string;
}

type AppAction = UpdateEquationAction | UpdateShapeAction;
