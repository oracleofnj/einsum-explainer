import { renderToString } from "katex";
import "katex/dist/katex.min.css";
import React from "react";
import { isErrorMessage, isContraction } from "../types/einsum_typeguards";
import makeLatexString from "../utils/makeLatexString";
import parseAndTypecheckJSON from "../utils/parseAndTypecheckJSON";

type EquationOutputProps = {
  explanationJSON: string;
};

const EquationOutput = (props: EquationOutputProps) => {
  const { explanationJSON } = props;
  let contractionErrorMessage;
  let dangerousKatexHTML;
  const explanation = parseAndTypecheckJSON(explanationJSON, isContraction, "validateAsJson");

  if (isErrorMessage(explanation)) {
    contractionErrorMessage = explanation.Err;
  } else {
    const contraction = explanation.Ok;
    const latexString = makeLatexString(contraction);
    dangerousKatexHTML = {
      __html: renderToString(latexString)
    };
  }

  return isErrorMessage(explanation) ? (
    <>
      <p>There was an error!</p>
      <p>{contractionErrorMessage}</p>
    </>
  ) : (
    <>
      <p>Everything is cool!</p>
      <div dangerouslySetInnerHTML={dangerousKatexHTML} />
    </>
  );
};

export default EquationOutput;
