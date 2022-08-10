import React, { ChangeEvent } from "react";
import PropTypes from "prop-types";
import { LanguageEnumeration } from "../../lib/types";
import {
  ALL_LANGUAGES_DEFAULT,
  LANGUAGES_ALL,
  LANGUAGE_LABEL_MAP,
} from "../../lib/constants";

export type PanelLanguageSelectProps = {
  language: LanguageEnumeration;
  onLanguageChange: (_: ChangeEvent<HTMLSelectElement>) => void;
  useDefault: boolean;
};

const PanelLanguageSelect = ({
  language,
  onLanguageChange,
  useDefault = false,
}: PanelLanguageSelectProps) => {
  return (
    <select name="select" value={language || ""} onChange={onLanguageChange}>
      {(useDefault ? ALL_LANGUAGES_DEFAULT : LANGUAGES_ALL).map((language) => {
        return (
          <option key={language} value={language}>
            {LANGUAGE_LABEL_MAP[language]}
          </option>
        );
      })}
    </select>
  );
};

PanelLanguageSelect.propTypes = {
  language: PropTypes.string,
  onLanguageChange: PropTypes.func.isRequired,
  useDefault: PropTypes.bool,
};

export default PanelLanguageSelect;
