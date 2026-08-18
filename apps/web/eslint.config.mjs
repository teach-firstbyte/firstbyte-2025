import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

// eslint-config-next@16 ships native flat configs, unlike dashboard's
// eslint-config-next@15 (still legacy, hence its FlatCompat wrapper). No
// FlatCompat needed here.
const eslintConfig = [
  // `next lint` (which auto-ignores .next/ and node_modules/) doesn't exist in
  // Next 16, so plain `eslint` needs these ignores spelled out explicitly.
  { ignores: [".next/**", "node_modules/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  eslintConfigPrettier,
  {
    rules: {
      // These React Compiler-derived rules are new in eslint-config-next@16
      // (dashboard's v15 config doesn't have them) and both flag patterns
      // that are widespread here: the mount-detection `useEffect(() =>
      // setMounted(true), [])` idiom, and helper functions called from
      // effects/handlers before their declaration in animation-heavy code
      // (use-mouse-position.tsx, three-model.tsx). Fixing that for real means
      // refactoring hydration and animation logic, not just linting - tracked
      // as a follow-up rather than done as part of adding tooling.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
];

export default eslintConfig;
