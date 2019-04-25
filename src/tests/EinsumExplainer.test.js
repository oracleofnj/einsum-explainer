import React from "react";
import ReactDOM from "react-dom";
import EinsumExplainer from "../components/EinsumExplainer";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<EinsumExplainer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
