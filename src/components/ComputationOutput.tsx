import React from "react";
import {
  isErrorMessage,
  FlattenedOperandResult,
  isFlattenedOperandResult
} from "../types/einsum_typeguards";
import parseOutput from "../utils/parseOutputString";

type ComputationOutputProps = {
  computationOutputJSON: string;
};

const ComputationOutput = (props: ComputationOutputProps) => {
  const { computationOutputJSON } = props;
  let errorMessage;
  let outputStr;
  let computationOutput: FlattenedOperandResult;
  const anyComputationOutput = JSON.parse(computationOutputJSON);
  if (isFlattenedOperandResult(anyComputationOutput)) {
    computationOutput = anyComputationOutput;
  } else {
    computationOutput = {
      Err: "slowEinsumAsJson returned an invalid response"
    };
  }

  if (isErrorMessage(computationOutput)) {
    errorMessage = computationOutput.Err;
  } else {
    outputStr = JSON.stringify(parseOutput(computationOutput.Ok));
  }

  return isErrorMessage(computationOutput) ? (
    <>
      <p>Something went wrong!</p>
      <div>{errorMessage}</div>
    </>
  ) : (
    <>
      <p>Your computation is valid!</p>
      <div>Einsum Result: {outputStr}</div>
    </>
  );
};

export default ComputationOutput;
