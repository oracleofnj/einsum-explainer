import React from "react";
import EquationOutput from "./EquationOutput";
import AxisLengthsOutput from "./AxisLengthsOutput";
import { AppState } from "../appstate/appState";
import {
  validateAsJson,
  validateAndSizeFromShapesAsStringAsJson,
  slowEinsumAsJson
} from "../pkg/einsum";
import { parseShapeString } from "../utils/parseShapeStrings";
import range from "../utils/range";
import ComputationOutput from "./ComputationOutput";

type ExplainerOutputProps = {
  appState: AppState;
};

const ExplainerOutput = (props: ExplainerOutputProps) => {
  const { appState } = props;
  const einsumString = appState.equation;
  const { visibleSizes } = appState;
  const shapes = appState.operandShapes.slice(0, visibleSizes);
  const contents = appState.operandContents.slice(0, visibleSizes);

  const explanationJSON = validateAsJson(einsumString);
  const sizedExplanationJSON = validateAndSizeFromShapesAsStringAsJson(
    einsumString,
    JSON.stringify(shapes.map(parseShapeString))
  );
  const operandsJSON = JSON.stringify(
    range(Math.min(shapes.length, contents.length)).map(i => {
      return {
        shape: parseShapeString(shapes[i]),
        contents: parseShapeString(contents[i])
      };
    })
  );
  const computationOutputJSON = slowEinsumAsJson(einsumString, operandsJSON);

  return (
    <>
      <EquationOutput explanationJSON={explanationJSON} />
      <AxisLengthsOutput sizedExplanationJSON={sizedExplanationJSON} />
      <ComputationOutput computationOutputJSON={computationOutputJSON} />
    </>
  );
};

export default ExplainerOutput;
