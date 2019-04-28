import React from "react";
import { isErrorMessage, isFlattenedOperandResult } from "../types/einsum_typeguards";
import parseOutput from "../utils/parseOutputString";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";

type ComputationOutputProps = {
  computationOutputJSON: string;
};

const ComputationOutput = (props: ComputationOutputProps) => {
  const { computationOutputJSON } = props;
  let errorMessage;
  let outputStr;
  const computationOutput = parseAndTypecheckJSON(
    computationOutputJSON,
    isFlattenedOperandResult,
    "slowEinsumAsJson"
  );

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
