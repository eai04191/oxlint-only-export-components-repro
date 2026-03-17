import reactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.tsx"],
        languageOptions: {
            parser: tsParser,
        },
        plugins: {
            "react-refresh": reactRefresh,
        },
        rules: {
            "react-refresh/only-export-components": [
                "error",
                { allowConstantExport: true },
            ],
        },
    },
];
