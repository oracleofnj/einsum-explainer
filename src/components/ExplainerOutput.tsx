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
    range(visibleSizes).map(i => {
      return {
        shape: parseShapeString(shapes[i]),
        contents: parseShapeString(contents[i])
      };
    })
  );
  const computationOutputJSON = slowEinsumAsJson(einsumString, operandsJSON);
  // let outputStr = "Nope";
  // try {
  //   const output = JSON.parse(computationOutputJSON);
  //   if (output.Ok) {
  //     outputStr = JSON.stringify(parseOutput(output.Ok.shape, output.Ok.contents));
  //   } else {
  //     outputStr = output.Err;
  //   }
  // } catch {
  //   outputStr = "Nope";
  // }

  return (
    <>
      <ContractionOutput explanationJSON={explanationJSON} />
      <AxisLengthsOutput sizedExplanationJSON={sizedExplanationJSON} />
      <ComputationOutput computationOutputJSON={computationOutputJSON} />
    </>
  );
};

export default ExplainerOutput;
