import React from "react";
import ContractionOutput from "./ContractionOutput";
import AxisLengthsOutput from "./AxisLengthsOutput";
import { AppState } from "./appState";
import { validateAsJson, validateAndSizeFromShapesAsStringAsJson } from "./pkg/einsum";
import { parseShapeString } from "./parseShapeStrings";

type ExplainerOutputProps = {
  appState: AppState;
};

const ExplainerOutput = (props: ExplainerOutputProps) => {
  const { appState } = props;
  const einsumString = appState.equation;
  const { visibleSizes } = appState;
  const shapes = appState.operandShapes.slice(0, visibleSizes);

  const explanationJSON = validateAsJson(einsumString);
  const sizedExplanationJSON = validateAndSizeFromShapesAsStringAsJson(
    einsumString,
    JSON.stringify(shapes.map(parseShapeString))
  );

  return (
    <>
      <ContractionOutput explanationJSON={explanationJSON} />
      <AxisLengthsOutput sizedExplanationJSON={sizedExplanationJSON} />
    </>
  );
};

export default ExplainerOutput;
