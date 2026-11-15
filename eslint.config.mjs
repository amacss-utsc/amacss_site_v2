import next from "eslint-config-next/core-web-vitals"
import { globalIgnores } from "eslint/config"

const config = [
  ...next,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "src/app/(payload)/admin/importMap.js",
    "src/payload-types.ts",
  ]),
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/static-components": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
]

export default config
