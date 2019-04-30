import { renderToString } from "katex";
import "katex/dist/katex.min.css";
import React from "react";
import { isErrorMessage, isContraction } from "../types/einsum_typeguards";
import makeLatexString from "../utils/makeLatexString";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";
import OutputColumn from "./layout/OutputColumn";

type EquationOutputProps = {
  explanationJSON: string;
};

const EquationOutput = (props: EquationOutputProps) => {
  const { explanationJSON } = props;
  const explanation = parseAndTypecheckJSON(explanationJSON, isContraction, "validateAsJson");
  const output = isErrorMessage(explanation)
    ? explanation
    : {
        Ok: (
          <div
            dangerouslySetInnerHTML={{
              __html: renderToString(makeLatexString(explanation.Ok))
            }}
          />
        )
      };

  return <OutputColumn output={output} />;
};

export default React.memo(EquationOutput);
