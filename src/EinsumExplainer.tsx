import React, { ChangeEvent, useReducer } from "react";
import ExplainerOutput from "./ExplainerOutput";
import {
  isContractionValidationResult,
  isSizedContractionValidationResult
} from "./einsum_typeguards";
import { validateAsJson, validateAndSizeFromShapesAsStringAsJson } from "./pkg/einsum.js";
import { parseShapeString } from "./parseShapeStrings";
import { reducer, initialState, appActions } from "./appState";

const EinsumExplainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const einsumString = state.equation;
  const { visibleSizes } = state;
  const shapes = state.operandShapes.slice(0, visibleSizes);

  const onEquationChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateEquation(e.target.value));
  };

  const makeOnShapeChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateShape(index, e.target.value));
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
      Err: "validateAndSizeFromShapesAsStringAsJson returned an invalid response"
    };
  }

  return (
    <>
      <p>
        Equation: <input type="text" onChange={onEquationChange} value={einsumString} />
      </p>
      <p>
        There appear{visibleSizes > 1 ? "" : "s"} to be {visibleSizes} input tensor
        {visibleSizes > 1 ? "s" : ""} in your equation.
      </p>
      {Array(visibleSizes)
        .fill(0)
        .map((_, index) => (
          <p>
            Shape of {String.fromCharCode(index + "A".charCodeAt(0))}:{" "}
            <input
              key={index}
              type="text"
              onChange={makeOnShapeChange(index)}
              value={typeof shapes[index] === "string" ? shapes[index] : "[]"}
            />
          </p>
        ))}
      <ExplainerOutput
        explanation={einsumExplanation}
        sizedExplanation={einsumSizedExplanation}
      />
    </>
  );
};

export default EinsumExplainer;
