const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToString } = require("react-dom/server");

// Load the actual TS sources with the production CJS package namespace shape.
function load(relativePath, overrides = {}) {
  const filename = path.resolve(__dirname, "..", relativePath);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = mod.require.bind(mod);
  mod.require = (id) => Object.hasOwn(overrides, id) ? overrides[id] : originalRequire(id);
  mod._compile(compiled, filename);
  return mod.exports;
}

const spiral = require("@aviala-design/spiral");
const { evaluateLiveCode } = load("src/lib/live-eval.ts");
const { NewComponentsDocPage } = load("src/pages/components/NewComponentsDocPage.tsx", {
  "@aviala-design/spiral": { ...spiral, default: spiral, __esModule: true },
  "../../components/ComponentDocView": { ComponentDocView: () => null },
});

for (const component of ["Rate", "MultiSelect", "InputGroup", "ButtonGroup"]) {
  const page = NewComponentsDocPage({ component });
  assert.ok(page.props.scope[component], `${component}: component exists`);
  assert.ok(!Object.hasOwn(page.props.scope, "default"));
  const result = evaluateLiveCode(page.props.fallback.liveCode, page.props.scope);
  assert.equal(result.error, null, component);
  assert.ok(React.isValidElement(result.element), `${component}: creates preview`);
  assert.equal(result.element.type, spiral[component]);
  assert.ok(renderToString(result.element).length > 0, `${component}: renders markup`);
  console.log(`${component}: live example passed`);
}
