import { build, emptyDir } from "jsr:@deno/dnt@^0.42.3";

// Read version from deno.json
const denoJson = JSON.parse(Deno.readTextFileSync("./deno.json"));
const version = Deno.args[0] || denoJson.version;

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    deno: {
      test: false,
    },
  },
  // Skip type checking - we'll rely on Deno's type checking
  typeCheck: false,
  // Don't include test files
  test: false,
  // Filter out test files from the build
  filterDiagnostic(diagnostic) {
    // Ignore diagnostics from test files
    if (diagnostic.file?.fileName.includes("_test")) {
      return false;
    }
    return true;
  },
  compilerOptions: {
    lib: ["ES2022", "DOM"],
    target: "ES2022",
  },
  package: {
    name: "@zerocity/define-ensure",
    version,
    description:
      "Type-safe runtime assertions with definable error factories and TypeScript narrowing",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/zerocity/define-ensure.git",
    },
    bugs: {
      url: "https://github.com/zerocity/define-ensure/issues",
    },
    homepage: "https://github.com/zerocity/define-ensure#readme",
    keywords: [
      "assert",
      "assertion",
      "ensure",
      "invariant",
      "typescript",
      "type-safe",
      "validation",
      "runtime",
      "tiny-invariant",
    ],
    engines: {
      node: ">=18",
    },
    sideEffects: false,
  },
  postBuild() {
    // Copy additional files
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");

    // Add types field to package.json
    const pkgPath = "./npm/package.json";
    const pkg = JSON.parse(Deno.readTextFileSync(pkgPath));
    pkg.types = "./esm/mod.d.ts";
    pkg.exports = {
      ".": {
        types: "./esm/mod.d.ts",
        import: "./esm/mod.js",
        require: "./script/mod.js",
      },
    };
    Deno.writeTextFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  },
});
