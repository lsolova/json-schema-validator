import { copy } from "esbuild-plugin-copy";
import * as esbuild from "esbuild";
import dtsPlugin from "esbuild-plugin-d.ts";

await esbuild.build({
  entryPoints: {
    "index": "script/src/index.ts",
  },
  outdir: "dist",
  bundle: true,
  external: [],
  format: "esm",
  target: "es2020",
  plugins: [
    dtsPlugin({
      tsconfig: "tsconfig.declarations.json",
    }),
    copy({
      resolveFrom: "cwd",
      assets: [{
        from: ["./script/wasm/schema_validator_bg.wasm"],
        to: ["./dist/assets/schema_validator.wasm"],
      }],
    }),
  ],
});

console.log("Package build complete!");
