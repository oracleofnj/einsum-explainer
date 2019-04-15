import React, { useState, ChangeEvent, FormEvent } from "react";
import { validateAsJson } from "./pkg/einsum.js";

const EinsumExplainer = () => {
  const [einsumString, setEinsumString] = useState("ij,jk->ik");

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEinsumString(e.target.value);
  };

  const einsumExplanation = JSON.parse(validateAsJson(einsumString));

  const isError = einsumExplanation.hasOwnProperty("Err");
  const errorMessage = isError && einsumExplanation.Err;
  const contraction = !isError && einsumExplanation.Ok;

  return (
    <>
      <p>
        <input type="text" onChange={onInputChange} value={einsumString} />
      </p>
      {isError ? (
        <>
          <p>There was an error!</p>
          <p>{errorMessage}</p>
        </>
      ) : (
        <>
          <p>Everything is cool!</p>
          <p>Operand indices: {JSON.stringify(contraction.operand_indices)}</p>
          <p>Output indices: {JSON.stringify(contraction.output_indices)}</p>
          <p>
            Summation indices: {JSON.stringify(contraction.summation_indices)}
          </p>
        </>
      )}
    </>
  );
};

export default EinsumExplainer;
