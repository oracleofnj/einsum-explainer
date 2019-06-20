import React from "react";
import { isErrorMessage, isEinsumPath } from "../types/einsum_typeguards";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";
import OutputColumn from "./layout/OutputColumn";
import { zipSteps, OrderAndStep, treeifySteps } from "../utils/showPath";
import EinsumPathDetails from "./EinsumPathDetails";

type EinsumPathOutputProps = {
  einsumPathJSON: string;
};

const EinsumPathOutput = (props: EinsumPathOutputProps) => {
  const { einsumPathJSON } = props;
  const einsumPath = parseAndTypecheckJSON(einsumPathJSON, isEinsumPath, "einsumPathAsJson");
  const steps = !isErrorMessage(einsumPath) && zipSteps(einsumPath.Ok);
  const pairs =
    steps &&
    !isErrorMessage(steps) &&
    steps.Ok &&
    steps.Ok.hasOwnProperty("Pairs") &&
    (steps.Ok as { Pairs: OrderAndStep[] }).Pairs;
  const tree = pairs && treeifySteps(pairs);
  const output = isErrorMessage(einsumPath)
    ? einsumPath
    : {
        Ok: (
          <>
            {tree && <EinsumPathDetails level={0} treeNode={tree} />}
            {/* <div>Einsum Path: {JSON.stringify(zipSteps(einsumPath.Ok))}</div> */}
          </>
        )
      };

  return <OutputColumn output={output} />;
};

export default React.memo(EinsumPathOutput);
