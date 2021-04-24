import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import nodePolyfills from "rollup-plugin-node-polyfills";
import copy from "rollup-plugin-copy";

export default [
  // Build the main Electron application file
  {
    input: "main.ts",
    output: {
      file: "../build/application.js",
      format: "cjs",
    },
    plugins: [
      nodeResolve(),
      typescript({ target: "ESNext" }),
      commonjs({
        include: "./node_modules/**",
      }),
      // Copy the node modules into the build directory
      copy({
        targets: [{ src: "./node_modules/*", dest: "../build/node_modules" }],
      }),
    ],
    // this is important as fuck, please read up on it before you mess with it.
    external: ["electron", "fs"],
  },
  // Build the ComponentBase for Component Injection
  {
    input: "Component/Component.ts",
    output: {
      file: "../build/ComponentBase.js",
      format: "cjs",
    },
    plugins: [
      nodeResolve(),
      typescript({ target: "es5" }),
      commonjs({
        include: "./node_modules/**",
      }),
      nodePolyfills(),
    ],
  },
];
