import React, { ChangeEvent } from "react";
import { appActions, AppAction } from "../appstate/appState";

type ContentsInputProps = {
  visibleSizes: number;
  operandContents: string[];
  dispatch: React.Dispatch<AppAction>;
};

const ContentsInput = ({ operandContents, visibleSizes, dispatch }: ContentsInputProps) => {
  const contents: string[] = [];
  for (let i = 0; i < visibleSizes; i++) {
    contents.push(i < operandContents.length ? operandContents[i] : "[]");
  }

  const makeOnContentsChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(appActions.updateContents(index, e.target.value));
  };

  return (
    <div>
      {contents.map((data, index) => (
        <div key={index}>
          <span>
            Contents of {String.fromCharCode(index + "A".charCodeAt(0))}:{" "}
            <input type="text" onChange={makeOnContentsChange(index)} value={data} />
          </span>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ContentsInput);
