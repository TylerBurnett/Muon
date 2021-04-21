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
    plugins: [typescript(), commonjs(), nodeResolve(), nodePolyfills()],
  },
  // Build the ComponentBase for Component Injection
  {
    input: "Component/Component.ts",
    output: {
      file: "../build/ComponentBase.js",
      format: "cjs",
    },
    plugins: [typescript(), commonjs(), nodeResolve(), nodePolyfills()],
  },
  /* Copy required resources
  {
    plugins: [
      copy({
        targets: [
          { src: "src/index.html", dest: "dist/public" },
          {
            src: ["assets/fonts/arial.woff", "assets/fonts/arial.woff2"],
            dest: "dist/public/fonts",
          },
          { src: "", dest: "dist/public/images" },
        ],
      }),
    ],
  },
  */
];
