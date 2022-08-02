export const pickLanguage = (classText: string) => {
  if (classText) {
    const splittedClassName = classText.split(" ");

    if (classText.includes("lang-py")) return "Python";
    if (classText.includes("lang-yaml")) return "Yaml";
    if (classText.includes("lang-js") || classText.includes("default"))
      return "Javascript";
    if (classText.includes("lang-ts")) return "Typescript";
    if (classText.includes("lang-c")) return "C";
    if (classText.includes("lang-cpp")) return "Cpp";
    if (classText.includes("lang-java")) return "Java";
    if (classText.includes("lang-apex")) return "Apex";
    if (classText.includes("lang-dart")) return "Dart";
    if (classText.includes("lang-golang")) return "Go";
    if (classText.includes("lang-php")) return "Php";
    if (classText.includes("lang-rb")) return "Ruby";
    if (classText.includes("lang-rust")) return "Rust";
    if (classText.includes("lang-scala")) return "Scala";
    if (classText.includes("lang-sh")) return "Shell";
    if (classText.includes("lang-kt")) return "Kotlin";
    if (classText.includes("lang-json")) return "Json";
    if (classText.includes("lang-hcl")) return "Terraform";

    return undefined;
  }
};
