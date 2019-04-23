import React, { ChangeEvent, FormEvent, useState } from "react";
import ExplainerOutput from "./ExplainerOutput";
import {
  isContractionValidationResult,
  isSizedContractionValidationResult
} from "./einsum_typeguards";
import {
  validateAsJson,
  validateAndSizeFromShapesAsStringAsJson
} from "./pkg/einsum.js";

const EinsumExplainer = () => {
  const [einsumString, setEinsumString] = useState("ij,jk->ik");
  const [shapes, setShapes] = useState("[[10,3],[3,20]]");

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEinsumString(e.target.value);
  };

  let einsumExplanation: ContractionValidationResult;
  const anyEinsumExplanation = JSON.parse(validateAsJson(einsumString));
  if (isContractionValidationResult(anyEinsumExplanation)) {
    einsumExplanation = anyEinsumExplanation;
  } else {
    einsumExplanation = { Err: "validateAsJson returned an invalid response" };
  }

  let einsumSizedExplanation: SizedContractionValidationResult;
  const anySizedEinsumExplanation = JSON.parse(
    validateAndSizeFromShapesAsStringAsJson(einsumString, shapes)
  );
  if (isSizedContractionValidationResult(anySizedEinsumExplanation)) {
    einsumSizedExplanation = anySizedEinsumExplanation;
  } else {
    einsumSizedExplanation = {
      Err:
        "validateAndSizeFromShapesAsStringAsJson returned an invalid response"
    };
  }

  return (
    <>
      <p>
        <input type="text" onChange={onInputChange} value={einsumString} />
      </p>
      <ExplainerOutput explanation={einsumSizedExplanation} />
    </>
  );
};

export default EinsumExplainer;
