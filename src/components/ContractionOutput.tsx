import { renderToString } from "katex";
import "katex/dist/katex.min.css";
import React from "react";
import {
  isErrorMessage,
  ContractionValidationResult,
  isContractionValidationResult
} from "../types/einsum_typeguards";
import makeLatexString from "../utils/makeLatexString";

type ContractionOutputProps = {
  explanationJSON: string;
};

const ContractionOutput = (props: ContractionOutputProps) => {
  const { explanationJSON } = props;
  let contractionErrorMessage;
  let dangerousKatexHTML;
  let explanation: ContractionValidationResult;
  const anyEinsumExplanation = JSON.parse(explanationJSON);
  if (isContractionValidationResult(anyEinsumExplanation)) {
    explanation = anyEinsumExplanation;
  } else {
    explanation = { Err: "validateAsJson returned an invalid response" };
  }

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

export default ContractionOutput;
