import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import EinsumExplainer from "./components/EinsumExplainer";
import * as serviceWorker from "./utils/serviceWorker";
import init from "./pkg/einsum.js";

(async function run() {
  await init("./pkg/einsum_bg.wasm");
  ReactDOM.render(<EinsumExplainer />, document.getElementById("root"));
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
