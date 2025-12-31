import * as esbuild from "esbuild";
import dtsPlugin from "esbuild-plugin-d.ts";

await esbuild.build({
  entryPoints: {
    "worker": "script/src/worker/worker.ts",
    "index": "script/src/index.ts",
  },
  bundle: true,
  external: [],
  format: "esm",
  outdir: "dist",
  target: "es2020",
  plugins: [dtsPlugin()],
});

console.log("Worker build complete!");
