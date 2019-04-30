import React from "react";

type InputColumnProps = {
  prompt: string;
  control: JSX.Element;
};

export default function InputColumn({ prompt, control }: InputColumnProps) {
  return (
    <div className="row">
      <div className="col-xs-4 col-lg-3">{prompt}</div>
      <div className="col-xs-8 col-lg-9">{control}</div>
    </div>
  );
}
