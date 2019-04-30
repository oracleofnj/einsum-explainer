import React from "react";

type InputOutputProps = {
  input: JSX.Element;
  output: JSX.Element;
};

export default function InputOutputRow({ input, output }: InputOutputProps) {
  return (
    <div className="row" style={{ paddingTop: "1em", paddingBottom: "1em" }}>
      <div className="col-xs-12 col-md-6">{input}</div>
      <div className="col-xs-12 col-md-6">{output}</div>
    </div>
  );
}
