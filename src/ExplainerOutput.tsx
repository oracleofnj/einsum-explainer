import { renderToString } from "katex";
import "katex/dist/katex.min.css";
import React from "react";
import { isErrorMessage } from "./einsum_typeguards";
import makeLatexString from "./makeLatexString";

type ExplainerOutputProps = {
  explanation: ContractionValidationResult;
  sizedExplanation: SizedContractionValidationResult;
};

const ExplainerOutput = (props: ExplainerOutputProps) => {
  const { explanation, sizedExplanation } = props;
  let contractionErrorMessage;
  let dangerousKatexHTML;
  let sizeErrorMessage;
  let outputSize;

  if (isErrorMessage(explanation)) {
    contractionErrorMessage = explanation.Err;
  } else {
    const contraction = explanation.Ok;
    const latexString = makeLatexString(contraction);
    dangerousKatexHTML = {
      __html: renderToString(latexString)
    };
  }

  if (isErrorMessage(sizedExplanation)) {
    sizeErrorMessage = sizedExplanation.Err;
  } else {
    outputSize = JSON.stringify(sizedExplanation.Ok.output_size);
  }

  return (
    <>
      {isErrorMessage(explanation) ? (
        <>
          <p>There was an error!</p>
          <p>{contractionErrorMessage}</p>
        </>
      ) : (
        <>
          <p>Everything is cool!</p>
          <div dangerouslySetInnerHTML={dangerousKatexHTML} />
        </>
      )}
      {isErrorMessage(sizedExplanation) ? (
        <>
          <p>The sizes don't work!</p>
          <p>{sizeErrorMessage}</p>
        </>
      ) : (
        <>
          <p>The operands match the input and the sizes check out!</p>
          <div>Output size: {outputSize}</div>
        </>
      )}
    </>
  );
};

export default ExplainerOutput;
