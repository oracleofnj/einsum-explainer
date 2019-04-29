import React from "react";
import { isErrorMessage, isSizedContraction, isContraction } from "../types/einsum_typeguards";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";

type AxisLengthOutputProps = {
  equationJSON: string;
  sizedExplanationJSON: string;
};

const AxisLengthsOutput = ({ equationJSON, sizedExplanationJSON }: AxisLengthOutputProps) => {
  let sizeErrorMessage;
  let outputSize;

  const explanation = parseAndTypecheckJSON(equationJSON, isContraction, "validateAsJson");

  const sizedExplanation = parseAndTypecheckJSON(
    sizedExplanationJSON,
    isSizedContraction,
    "validateAndSizeFromShapesAsStringAsJson"
  );

  if (isErrorMessage(sizedExplanation)) {
    sizeErrorMessage = sizedExplanation.Err;
  } else if (isErrorMessage(explanation)) {
    sizeErrorMessage = explanation.Err;
  } else {
    // export type Contraction = {
    //   operand_indices: string[];
    //   output_indices: string[];
    //   summation_indices: string[];
    // };
    const contraction = explanation.Ok;

    // export type SizedContraction = {
    //   contraction: Contraction;
    //   output_size: OutputSize;
    // };
    // export type OutputSize = { [key: string]: number };
    const outputMap = sizedExplanation.Ok.output_size;

    outputSize = (
      <div>
        <div>
          Output size: [{contraction.output_indices.join(", ")}] ={" "}
          {JSON.stringify(contraction.output_indices.map(x => outputMap[x]))}
        </div>
        <div>
          Summation index lengths:{" "}
          {contraction.summation_indices.map(x => (
            <span key={x}>
              {x}: {outputMap[x]}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return isErrorMessage(sizedExplanation) ? (
    <>
      <p>The sizes don't work!</p>
      <p>{sizeErrorMessage}</p>
    </>
  ) : (
    <>
      <p>The operands match the input and the sizes check out!</p>
      {outputSize}
    </>
  );
};

export default AxisLengthsOutput;
