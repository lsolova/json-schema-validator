import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: {
    "worker": "src/worker/worker.ts",
    "index": "src/index.ts",
  },
  bundle: true,
  external: [],
  format: "esm",
  outdir: "dist",
  target: "es2020",
});

console.log("Worker build complete!");
