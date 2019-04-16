import React, { useState, ChangeEvent, FormEvent } from "react";
import { validateAsJson } from "./pkg/einsum.js";
import ExplainerOutput from "./ExplainerOutput";

const EinsumExplainer = () => {
  const [einsumString, setEinsumString] = useState("ij,jk->ik");

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEinsumString(e.target.value);
  };

  const einsumExplanation = JSON.parse(validateAsJson(einsumString));

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
