import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Result, isErrorMessage } from "../../types/einsum_typeguards";

type OutputColumnProps = {
  output: Result<JSX.Element>;
};

export default function OutputColumn({ output }: OutputColumnProps) {
  return (
    <div className="row">
      <div className="col-xs-3">
        {isErrorMessage(output) ? (
          <FontAwesomeIcon
            title="Something went wrong!"
            icon={faTimesCircle}
            size="2x"
            color="orangered"
          />
        ) : (
          <FontAwesomeIcon
            title="Everything is cool!"
            icon={faCheckCircle}
            size="2x"
            color="darkgreen"
          />
        )}
      </div>
      <div className="col-xs-9">{isErrorMessage(output) ? output.Err : output.Ok}</div>
    </div>
  );
}
