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
import parseOutput from "../utils/parseOutputString";

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
    range(visibleSizes).map(i => {
      let flattenedContents: number[] = [];
      let unflattenedContents: any[];
      try {
        unflattenedContents = JSON.parse(contents[i]);
        flattenedContents = unflattenedContents.flat(2 ** 16);
      } catch {
        flattenedContents = [];
      }

      return {
        shape: parseShapeString(shapes[i]),
        contents: flattenedContents
      };
    })
  );
  const outputJSON = slowEinsumAsJson(einsumString, attemptJSON);
  let outputStr = "Nope";
  try {
    const output = JSON.parse(outputJSON);
    if (output.Ok) {
      outputStr = JSON.stringify(parseOutput(output.Ok.shape, output.Ok.contents));
    } else {
      outputStr = output.Err;
    }
  } catch {
    outputStr = "Nope";
  }

  return (
    <>
      <ContractionOutput explanationJSON={explanationJSON} />
      <AxisLengthsOutput sizedExplanationJSON={sizedExplanationJSON} />
      {outputStr}
    </>
  );
};

export default ExplainerOutput;
