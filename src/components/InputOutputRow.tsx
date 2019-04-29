import React from "react";
import "flexboxgrid";

type InputOutputProps = {
  input: JSX.Element;
  output: JSX.Element;
};

export default function InputOutputRow({ input, output }: InputOutputProps) {
  return (
    <div className="row">
      <div className="col-xs-12 col-md-6">{input}</div>
      <div className="col-xs-12 col-md-6">{output}</div>
    </div>
  );
}
