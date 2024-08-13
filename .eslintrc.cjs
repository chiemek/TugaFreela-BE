module.exports = {
  env: {
    node: true, // Indicates that this environment is Node.js
    es2021: true, // Enables ES2021 globals and syntax
  },
  extends: [
    "eslint:recommended", // Use recommended ESLint rules
    "plugin:node/recommended", // Use recommended Node.js rules
  ],
  parserOptions: {
    ecmaVersion: 2021, // Use the latest ECMAScript version
    sourceType: "module", // Allow ECMAScript modules (if you're using import/export)
  },
  rules: {
    // Your custom rules here
  },
  plugins: [
    "node", // Ensure ESLint knows you're using the Node.js plugin
  ],
};
