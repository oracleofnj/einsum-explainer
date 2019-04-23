import { renderToString } from "katex";
import "katex/dist/katex.min.css";
import React from "react";
import { isErrorMessage } from "./einsum_typeguards";
import makeLatexString from "./makeLatexString";

declare type ExplainerOutputProps = {
  explanation: SizedContractionValidationResult;
};

const ExplainerOutput = (props: ExplainerOutputProps) => {
  const { explanation } = props;
  if (isErrorMessage(explanation)) {
    const errorMessage = explanation.Err;
    return (
      <>
        <p>There was an error!</p>
        <p>{errorMessage}</p>
      </>
    );
  } else {
    const sizedValidationResult = explanation.Ok;
    const { contraction, output_size } = sizedValidationResult;
    const latexString = makeLatexString(contraction);
    const dangerousKatexHTML = {
      __html: renderToString(latexString)
    };

    return (
      <>
        <p>Everything is cool!</p>
        <div dangerouslySetInnerHTML={dangerousKatexHTML} />
        <p>{JSON.stringify(output_size)}</p>
      </>
    );
  }
};

export default ExplainerOutput;
