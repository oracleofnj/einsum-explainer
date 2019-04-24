import React, { ChangeEvent, useState, useReducer } from "react";
import ExplainerOutput from "./ExplainerOutput";
import {
  isContractionValidationResult,
  isSizedContractionValidationResult
} from "./einsum_typeguards";
import {
  validateAsJson,
  validateAndSizeFromShapesAsStringAsJson
} from "./pkg/einsum.js";
import { parseShapeString } from "./parseShapeStrings";
import { stat } from "fs";

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

type AppAction = UpdateEquationAction;

const initialState: AppState = {
  equation: "ij,jk->ik",
  visibleSizes: 2,
  operandShapes: ["[10,3]", "[3,20]"]
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "updateEquation":
      return {
        ...state,
        equation: (action as UpdateEquationAction).equation
      };
      break;
    default:
      return state;
  }
}

const EinsumExplainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const einsumString = state.equation;
  const shapes = state.operandShapes;

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "updateEquation", equation: e.target.value });
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
        <input type="text" onChange={onInputChange} value={einsumString} />
      </p>
      <ExplainerOutput
        explanation={einsumExplanation}
        sizedExplanation={einsumSizedExplanation}
      />
    </>
  );
};

export default EinsumExplainer;
