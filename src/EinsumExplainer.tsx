import React, { ChangeEvent, FormEvent, useState } from "react";
import ExplainerOutput from "./ExplainerOutput";
import { isValidationResult } from "./einsum_typeguards";
import { validateAsJson } from "./pkg/einsum.js";

const EinsumExplainer = () => {
  const [einsumString, setEinsumString] = useState("ij,jk->ik");

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEinsumString(e.target.value);
  };

  let einsumExplanation: ValidationResult;
  const anyEinsumExplanation = JSON.parse(validateAsJson(einsumString));
  if (isValidationResult(anyEinsumExplanation)) {
    einsumExplanation = anyEinsumExplanation;
  } else {
    einsumExplanation = { Err: "validateAsJson returned an invalid response" };
  }

  return (
    <>
      <p>
        <input type="text" onChange={onInputChange} value={einsumString} />
      </p>
      <ExplainerOutput explanation={einsumExplanation} />
    </>
  );
};

export default EinsumExplainer;
