import katex from "katex";
import "katex/dist/katex.min.css";
import React from "react";
import { isErrorMessage } from "./einsum_typeguards";
import makeLatexString from "./makeLatexString";

declare type ExplainerOutputProps = {
  explanation: ValidationResult;
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
    const contraction: Contraction = explanation.Ok;
    const latexString = makeLatexString(contraction);
    const dangerousKatexHTML = {
      __html: katex.renderToString(latexString)
    };

    return (
      <>
        <p>Everything is cool!</p>
        <div dangerouslySetInnerHTML={dangerousKatexHTML} />
      </>
    );
  }
};

export default ExplainerOutput;
