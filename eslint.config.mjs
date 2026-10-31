import next from "eslint-config-next"

const config = [
  ...next,
  {
    ignores: [".next/**", "**/node_modules/**", "media/**", "public/media/**", "src/payload-types.ts", "src/app/(payload)/admin/importMap.js", ".tmp/**", "**/.git/**", "**/.hg/**", "**/.pnp.*", "**/.svn/**", "**/.yarn/**", "**/build/**", "**/dist/**", "**/temp/**", "playwright.config.ts", "jest.config.js"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    // React Compiler is not enabled. Surface its new diagnostics without
    // changing the existing lint gate during the security upgrade.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/set-state-in-render": "warn",
    },
  },
]

export default config
