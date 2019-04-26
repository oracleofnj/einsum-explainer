import React from "react";
import ContractionOutput from "./ContractionOutput";
import AxisLengthsOutput from "./AxisLengthsOutput";
import { AppState } from "../appstate/appState";
import {
  validateAsJson,
  validateAndSizeFromShapesAsStringAsJson,
  slowEinsumAsJson
} from "../pkg/einsum";
import { parseShapeString } from "../utils/parseShapeStrings";
import range from "../utils/range";

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
  const attemptJSON = JSON.stringify(
    range(visibleSizes).map(i => ({
      shape: JSON.parse(shapes[i]),
      contents: JSON.parse(contents[i])
    }))
  );
  const outputJSON = slowEinsumAsJson(einsumString, attemptJSON);

  return (
    <>
      <ContractionOutput explanationJSON={explanationJSON} />
      <AxisLengthsOutput sizedExplanationJSON={sizedExplanationJSON} />
      {attemptJSON}
      {outputJSON}
    </>
  );
};

export default ExplainerOutput;
