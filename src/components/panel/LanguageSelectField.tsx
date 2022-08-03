import React, { ChangeEvent } from "react";
import PropTypes from "prop-types";
import { LanguageEnumeration } from "../../types";
import { ALL_LANGUAGES, ALL_LANGUAGES_DEFAULT } from "../../constants";

export type LanguageSelectFieldProps = {
  language: LanguageEnumeration;
  onLanguageChange: (_: ChangeEvent<HTMLSelectElement>) => void;
  useDefault: boolean;
  className: string;
};

const LanguageSelectField = ({
  language,
  onLanguageChange,
  useDefault = false,
  className,
}: LanguageSelectFieldProps) => {
  return (
    <div>
      <select
        name="select"
        className="w-100"
        style={{
          padding: ".3rem",
          fontSize: "15px",
          backgroundColor: "white",
          margin: "0.2rem 0",
          color: "black",
          borderRadius: "3px",
          border: "1px solid rgb(118, 118, 118)",
        }}
        value={language || ""}
        onChange={onLanguageChange}
      >
        {(useDefault ? ALL_LANGUAGES_DEFAULT : ALL_LANGUAGES).map(
          (language) => {
            return (
              <option key={language} value={language}>
                {language}
              </option>
            );
          },
        )}
      </select>
    </div>
  );
};

LanguageSelectField.propTypes = {
  language: PropTypes.string,
  onLanguageChange: PropTypes.func.isRequired,
  useDefault: PropTypes.bool,
  className: PropTypes.string,
};

export default LanguageSelectField;
