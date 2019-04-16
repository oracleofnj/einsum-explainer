import React from "react";
import katex from "katex";
import makeLatexString from "./makeLatexString";
import { Contraction } from "./einsum_types";
import "katex/dist/katex.min.css";

type Explanation = { explanation: any };

const ExplainerOutput = ({ explanation }: Explanation) => {
  if (explanation.hasOwnProperty("Err")) {
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
    console.log(dangerousKatexHTML);

    return (
      <>
        <p>Everything is cool!</p>
        {/* <p>Latex String:{latexString}</p> */}
        <div dangerouslySetInnerHTML={dangerousKatexHTML} />
      </>
    );
  }
};

export default ExplainerOutput;
