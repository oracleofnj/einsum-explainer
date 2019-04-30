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
      <div className="col-xs-2 col-xs-offset-2 col-md-offset-0 col-md-1">
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
      <div className="col-xs-8 col-md-11">
        {isErrorMessage(output) ? output.Err : output.Ok}
      </div>
    </div>
  );
}
