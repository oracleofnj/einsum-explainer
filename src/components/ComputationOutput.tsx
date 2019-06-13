import React from "react";
import { isErrorMessage, isFlattenedOperand, isEinsumPath } from "../types/einsum_typeguards";
import parseOutput from "../utils/parseOutputString";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";
import OutputColumn from "./layout/OutputColumn";

type ComputationOutputProps = {
  einsumPathJSON: string;
  computationOutputJSON: string;
};

const ComputationOutput = (props: ComputationOutputProps) => {
  const { computationOutputJSON, einsumPathJSON } = props;
  const computationOutput = parseAndTypecheckJSON(
    computationOutputJSON,
    isFlattenedOperand,
    "slowEinsumAsJson"
  );
  const einsumPath = parseAndTypecheckJSON(einsumPathJSON, isEinsumPath, "einsumPathAsJson");
  const output = isErrorMessage(computationOutput)
    ? computationOutput
    : isErrorMessage(einsumPath)
    ? einsumPath
    : {
        Ok: (
          <>
            Einsum Result:{" "}
            <div>{JSON.stringify(parseOutput(computationOutput.Ok), null, 2)}</div>
            <div>Einsum Path: {JSON.stringify(einsumPath.Ok)}</div>
          </>
        )
      };

  return <OutputColumn output={output} />;
};

export default React.memo(ComputationOutput);
