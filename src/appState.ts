import updateEquationDuck, { UpdateEquationAction } from "./ducks/updateEquation";
import updateShapeDuck, { UpdateShapeAction } from "./ducks/updateShape";
import { makeReducer } from "./makeReducer";

// What is the state of the app?
// (1) The string the user entered
// (2) How many arrays are visible that can have a size entered
// (3) The sizes that have been entered (as strings)
//
// Note: (1) and (2) can conflict
// This is OK!
// However, when the string changes, update (2) automatically if the new string is valid

export type AppState = {
  equation: string;
  visibleSizes: number;
  operandShapes: string[];
};

const initialState: AppState = {
  equation: "ij,jk->ik",
  visibleSizes: 2,
  operandShapes: ["[10,3]", "[3,20]"]
};

export type AppAction = UpdateEquationAction | UpdateShapeAction;

const appActions = {
  updateEquation: updateEquationDuck.actionCreator,
  updateShape: updateShapeDuck.actionCreator
};
const reducer = makeReducer([updateEquationDuck, updateShapeDuck]);

export { initialState, reducer, appActions };
