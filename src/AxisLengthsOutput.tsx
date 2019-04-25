import React from "react";
import {
  isErrorMessage,
  SizedContractionValidationResult,
  isSizedContractionValidationResult
} from "./einsum_typeguards";

type AxisLengthOutputProps = {
  sizedExplanationJSON: string;
};

const AxisLengthsOutput = (props: AxisLengthOutputProps) => {
  const { sizedExplanationJSON } = props;
  let sizeErrorMessage;
  let outputSize;
  let sizedExplanation: SizedContractionValidationResult;
  const anySizedExplanation = JSON.parse(sizedExplanationJSON);
  if (isSizedContractionValidationResult(anySizedExplanation)) {
    sizedExplanation = anySizedExplanation;
  } else {
    sizedExplanation = {
      Err: "validateAndSizeFromShapesAsStringAsJson returned an invalid response"
    };
  }

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
