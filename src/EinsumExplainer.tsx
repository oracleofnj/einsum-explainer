import React, { ChangeEvent, useReducer } from "react";
import ExplainerOutput from "./ExplainerOutput";
import {
  isContractionSuccess,
  isContractionValidationResult,
  isSizedContractionValidationResult
} from "./einsum_typeguards";
import {
  validateAsJson,
  validateAndSizeFromShapesAsStringAsJson
} from "./pkg/einsum.js";
import { parseShapeString } from "./parseShapeStrings";

// What is the state of the app?
// (1) The string the user entered
// (2) How many arrays are visible that can have a size entered
// (3) The sizes that have been entered (as strings)
//
// Note: (1) and (2) can conflict
// This is OK!
// However, when the string changes, update (2) automatically if the new string is valid

declare type AppState = {
  equation: string;
  visibleSizes: number;
  operandShapes: string[];
};

interface AnyAction {
  type: string;
}

interface UpdateEquationAction extends AnyAction {
  equation: string;
}

interface UpdateShapeAction extends AnyAction {
  index: number;
  shape: string;
}

type AppAction = UpdateEquationAction | UpdateShapeAction;

const initialState: AppState = {
  equation: "ij,jk->ik",
  visibleSizes: 2,
  operandShapes: ["[10,3]", "[3,20]"]
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "updateEquation":
      const { equation } = action as UpdateEquationAction;
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

    case "updateShape":
      const { index, shape } = action as UpdateShapeAction;
      return {
        ...state,
        operandShapes: [
          ...state.operandShapes.slice(0, index),
          shape,
          ...state.operandShapes.slice(index + 1)
        ]
      };

    default:
      return state;
  }
}

const EinsumExplainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const einsumString = state.equation;
  const { visibleSizes } = state;
  const shapes = state.operandShapes.slice(0, visibleSizes);

  const onEquationChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "updateEquation", equation: e.target.value });
  };

  const makeOnShapeChange = (index: number) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({ type: "updateShape", index, shape: e.target.value });
  };

  let einsumExplanation: ContractionValidationResult;
  const anyEinsumExplanation = JSON.parse(validateAsJson(einsumString));
  if (isContractionValidationResult(anyEinsumExplanation)) {
    einsumExplanation = anyEinsumExplanation;
  } else {
    einsumExplanation = { Err: "validateAsJson returned an invalid response" };
  }

  let einsumSizedExplanation: SizedContractionValidationResult;
  const anySizedEinsumExplanation = JSON.parse(
    validateAndSizeFromShapesAsStringAsJson(
      einsumString,
      JSON.stringify(shapes.map(parseShapeString))
    )
  );
  if (isSizedContractionValidationResult(anySizedEinsumExplanation)) {
    einsumSizedExplanation = anySizedEinsumExplanation;
  } else {
    einsumSizedExplanation = {
      Err:
        "validateAndSizeFromShapesAsStringAsJson returned an invalid response"
    };
  }

  return (
    <>
      <p>
        <input type="text" onChange={onEquationChange} value={einsumString} />
      </p>
      {Array(visibleSizes)
        .fill(0)
        .map((_, index) => (
          <p>
            <input
              key={index}
              type="text"
              onChange={makeOnShapeChange(index)}
              value={typeof shapes[index] === "string" ? shapes[index] : "[]"}
            />
          </p>
        ))}
      <p>
        There appear{visibleSizes > 1 ? "" : "s"} to be {visibleSizes} input
        tensor{visibleSizes > 1 ? "s" : ""} in your equation.
      </p>
      <ExplainerOutput
        explanation={einsumExplanation}
        sizedExplanation={einsumSizedExplanation}
      />
    </>
  );
};

export default EinsumExplainer;
