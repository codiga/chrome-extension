const pickLanguage = () => {
    const fileName = pickFilename();

    if(fileName === "Dockerfile") return "Docker";

    const splittedFileName = fileName.split('.');
    const extension = splittedFileName[splittedFileName.length - 1];

    return {
        "js": "Javascript",
        "py": "Python",
        "java": "Java",
        "cls": "Apex",
        "c": "C",
        "cpp": "Cpp",
        "dart": "Dart",
        "go": "Go",
        "php": "Php",
        "rb": "Ruby",
        "rs": "Rust",
        "scala": "Scala",
        "sh": "Shell",
        "ts": "Typescript",
        "kt": "Kotlin",
        "yaml": "Yaml",
        "json": "Json",
        "tf": "Terraform"
    }[extension] || "Unknown";
}