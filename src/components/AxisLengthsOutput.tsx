import React from "react";
import { isErrorMessage, isSizedContractionValidationResult } from "../types/einsum_typeguards";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";

type AxisLengthOutputProps = {
  sizedExplanationJSON: string;
};

const AxisLengthsOutput = (props: AxisLengthOutputProps) => {
  const { sizedExplanationJSON } = props;
  let sizeErrorMessage;
  let outputSize;

  const sizedExplanation = parseAndTypecheckJSON(
    sizedExplanationJSON,
    isSizedContractionValidationResult,
    "validateAndSizeFromShapesAsStringAsJson"
  );

  if (isErrorMessage(sizedExplanation)) {
    sizeErrorMessage = sizedExplanation.Err;
  } else {
    outputSize = JSON.stringify(sizedExplanation.Ok.output_size);
  }

  return isErrorMessage(sizedExplanation) ? (
    <>
      <p>The sizes don't work!</p>
      <p>{sizeErrorMessage}</p>
    </>
  ) : (
    <>
      <p>The operands match the input and the sizes check out!</p>
      <div>Output size: {outputSize}</div>
    </>
  );
};

export default AxisLengthsOutput;
