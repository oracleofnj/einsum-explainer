import React, { Component, useState } from "react";
import EinsumExplainer from "./EinsumExplainer";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <EinsumExplainer />
      </header>
    </div>
  );
};

export default App;
