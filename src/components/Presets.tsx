import React, { ChangeEvent, useState } from "react";
import { appActions, AppAction } from "../appstate/appState";
import InputColumn from "./layout/InputColumn";
import InputOutputRow from "./layout/InputOutputRow";
import presets from "../appstate/presets";

type PresetsProps = {
  dispatch: React.Dispatch<AppAction>;
};

const Presets = ({ dispatch }: PresetsProps) => {
  const presetChoices = Object.entries(presets);
  const [selectedPreset, setSelectedPreset] = useState(presetChoices[0][0]);
  const onPresetSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPreset(e.target.value);
    dispatch(appActions.loadPreset(e.target.value));
  };

  return (
    <InputOutputRow
      input={
        <InputColumn
          prompt="Try one:"
          control={
            <select value={selectedPreset} onChange={onPresetSelect}>
              {presetChoices.map(([name, preset]) => (
                <option key={name} value={name}>
                  {preset.description}
                </option>
              ))}
            </select>
          }
        />
      }
      output={<></>}
    />
  );
};

export default React.memo(Presets);
