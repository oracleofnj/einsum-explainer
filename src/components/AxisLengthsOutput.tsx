import React from "react";
import {
  isErrorMessage,
  isSizedContraction,
  isContraction,
  Result
} from "../types/einsum_typeguards";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";
import OutputColumn from "./layout/OutputColumn";

type AxisLengthOutputProps = {
  equationJSON: string;
  sizedExplanationJSON: string;
};

const AxisLengthsOutput = ({ equationJSON, sizedExplanationJSON }: AxisLengthOutputProps) => {
  let output: Result<JSX.Element>;

  const explanation = parseAndTypecheckJSON(equationJSON, isContraction, "validateAsJson");

  const sizedExplanation = parseAndTypecheckJSON(
    sizedExplanationJSON,
    isSizedContraction,
    "validateAndSizeFromShapesAsStringAsJson"
  );

  if (isErrorMessage(sizedExplanation)) {
    output = sizedExplanation;
  } else if (isErrorMessage(explanation)) {
    output = explanation;
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

    output = {
      Ok: (
        <div>
          <div>
            Output size: [{contraction.output_indices.join(", ")}] ={" "}
            {JSON.stringify(contraction.output_indices.map(x => outputMap[x]))}
          </div>
          <div>
            Summation index lengths:{" "}
            {contraction.summation_indices.map(x => `${x}: ${outputMap[x]}`).join("; ")}
          </div>
        </div>
      )
    };
  }

  return <OutputColumn output={output} />;
};

export default React.memo(AxisLengthsOutput);
