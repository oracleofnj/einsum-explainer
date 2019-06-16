import React from "react";
import { isErrorMessage, isFlattenedOperand } from "../types/einsum_typeguards";
import parseOutput from "../utils/parseOutputString";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";
import OutputColumn from "./layout/OutputColumn";

type ComputationOutputProps = {
  computationOutputJSON: string;
};

const ComputationOutput = (props: ComputationOutputProps) => {
  const { computationOutputJSON } = props;
  const computationOutput = parseAndTypecheckJSON(
    computationOutputJSON,
    isFlattenedOperand,
    "slowEinsumAsJson"
  );
  const output = isErrorMessage(computationOutput)
    ? computationOutput
    : {
        Ok: (
          <>
            Einsum Result:{" "}
            <div>{JSON.stringify(parseOutput(computationOutput.Ok), null, 2)}</div>
          </>
        )
      };

  return <OutputColumn output={output} />;
};

export default React.memo(ComputationOutput);
