import updateEquationDuck, { UpdateEquationAction } from "./ducks/updateEquation";
import updateShapeDuck, { UpdateShapeAction } from "./ducks/updateShape";
import updateContentsDuck, { UpdateContentsAction } from "./ducks/updateContents";
import addShapeDuck, { AddShapeAction } from "./ducks/addShape";
import makeReducer from "./makeReducer";
import range from "../utils/range";
import makeOperand from "./makeOperand";

// What is the state of the app?
// (1) The string the user entered
// (2) How many arrays are visible that can have a size entered
// (3) The shapes that have been entered (as strings)
// (4) The contents that have been entered (as strings)
//
// Note: (1) and (2) can conflict
// This is OK!
// However, when the string changes, update (2) automatically if the new string is valid

// To make a new action:
// (1) Make a duck (type, typeguard, actionCreator, reducer)
// (2) Export the duck and an interface extending AnyAction from the duck file
// (3) Import the duck and the action in this file
// (4) Add the action to "type AppAction"
// (5) Add the action to "const appActions"
// (6) Add the duck to the call to makeReducer()

export type operandState = {
  shapeStr: string;
  contentsStr: string;
  contentsVector: number[];
};

export type AppState = {
  equation: string;
  visibleSizes: number;
  operandStates: operandState[];
};

const initialState: AppState = {
  equation: "ij,jk->ik",
  visibleSizes: 2,
  operandStates: [
    makeOperand([2, 3], 0, 1),
    makeOperand([3, 5], 0, 10),
    ...Array(254).fill(makeOperand([]))
  ]
};

export type AppAction =
  | AddShapeAction
  | UpdateEquationAction
  | UpdateShapeAction
  | UpdateContentsAction;

const appActions = {
  addShape: addShapeDuck.actionCreator,
  updateEquation: updateEquationDuck.actionCreator,
  updateShape: updateShapeDuck.actionCreator,
  updateContents: updateContentsDuck.actionCreator
};
const reducer = makeReducer([
  addShapeDuck,
  updateEquationDuck,
  updateShapeDuck,
  updateContentsDuck
]);

export { initialState, reducer, appActions };
