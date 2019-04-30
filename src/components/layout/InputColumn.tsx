import React from "react";

type InputColumnProps = {
  prompt: string;
  control: JSX.Element;
};

export default function InputColumn({ prompt, control }: InputColumnProps) {
  return (
    <div className="row">
      <div className="col-xs-3">{prompt}</div>
      <div className="col-xs-9">{control}</div>
    </div>
  );
}
