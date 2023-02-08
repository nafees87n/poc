import nodeResolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import commonjs from "@rollup/plugin-commonjs";

const OUTPUT_DIR = "dist";

const plugins = [nodeResolve(), commonjs()];

export default [
  {
    input: "src/content.js",
    output: {
      file: `${OUTPUT_DIR}/content.js`,
      format: "iife",
    },
    plugins: [...plugins],
  },
  {
    input: "@inboxsdk/core/pageWorld.js",
    output: {
      file: `${OUTPUT_DIR}/pageWorld.js`,
      format: "iife",
    },
    plugins: [...plugins],
  },
  {
    input: "src/background.js",
    output: {
      file: `${OUTPUT_DIR}/background.js`,
      format: "iife",
    },
    plugins: [
      ...plugins,
      copy({
        targets: [
          {
            src: "src/manifest.json",
            dest: OUTPUT_DIR,
          },
        ],
      }),
    ],
  },
];
