import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm, lstat, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
assert.equal(process.version, "v24.16.0", "Use the declared Node toolchain");
assert.equal(manifest.private, true, "Candidate qualification cannot publish a package");
assert.equal(manifest.exports?.["."]?.import, "./dist/workroom/index.js", "Declare a supported installed ESM entry point");
assert.equal(manifest.exports?.["."]?.types, "./dist/workroom/index.d.ts", "Declare the installed type contract");
assert.deepEqual(manifest.dependencies, {}, "The foundation has no host/runtime dependencies");

const temp = await mkdtemp(join(tmpdir(), "dpf-workroom-installed-"));
const env = { ...process.env, NODE_PATH: "", NODE_OPTIONS: "" };
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, env, encoding: "utf8" });
  assert.equal(result.status, 0, `${command} ${args.join(" ")} failed:\n${result.stdout}${result.stderr}`);
  return result.stdout;
}
try {
  const packed = JSON.parse(run("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", temp]))[0];
  const tarball = join(temp, packed.filename);
  assert(packed.files.some(file => file.path === "dist/workroom/index.js"));
  assert(packed.files.some(file => file.path === "dist/workroom/index.d.ts"));
  assert(!packed.files.some(file => file.path.startsWith("dist/gpp/constructs-used-by.")), "GPP analysis must not become a second Workroom implementation");
  assert(!packed.files.some(file => /^(?:node_modules|packages|\.env)(?:\/|$)/.test(file.path)), "Ship built contracts, never source aliases or host configuration");
  const consumer = join(temp, "consumer");
  await mkdir(join(consumer, "src"), { recursive: true });
  await writeFile(join(consumer, "package.json"), JSON.stringify({ name: "installed-workroom-consumer", private: true, type: "module" }));
  run("npm", ["install", "--engine-strict", "--ignore-scripts", "--no-audit", "--no-fund", "--package-lock=false", tarball], consumer);
  // Node's CommonJS source loaders must select the same synchronous ESM
  // distribution as native imports, never another implementation or a deep path.
  const commonJsProgram = `
    const assert = require('node:assert/strict');
    (async () => {
      for (const specifier of ${JSON.stringify(Object.keys(manifest.exports).map(key => manifest.name + (key === "." ? "" : key.slice(1))))}) {
        const loaded = require(specifier);
        const imported = await import(specifier);
        assert.deepEqual(Object.keys(loaded).sort(), Object.keys(imported).sort());
        for (const key of Object.keys(imported)) assert.equal(loaded[key], imported[key], specifier + ':' + key);
      }
      for (const path of ['${manifest.name}/dist/workroom/index.js', '${manifest.name}/process/constructs-used-by']) {
        assert.throws(() => require(path), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
      }
    })().catch(error => { console.error(error); process.exitCode = 1; });
  `;
  run(process.execPath, ["--input-type=commonjs", "--eval", commonJsProgram], consumer);
  const installed = join(consumer, "node_modules", ...manifest.name.split("/"));
  assert(!(await lstat(installed)).isSymbolicLink(), "Receiver must install actual tarball content");
  for (const name of ["host.ts", "practices.ts", "smoke.ts"]) {
    const source = await readFile(join(root, "examples/workroom-kernel/src", name), "utf8");
    await writeFile(join(consumer, "src", name), source.replaceAll("../kernel/workroom/index.js", manifest.name));
  }
  const everyExport = Object.keys(manifest.exports).map((key, index) => {
    const specifier = manifest.name + (key === "." ? "" : key.slice(1));
    return `import * as publicExport${index} from ${JSON.stringify(specifier)}; void publicExport${index};\n`;
  }).join("");
  await writeFile(join(consumer, "src/exports.ts"), everyExport + `import * as root from '${manifest.name}';\n`
    + `import * as graph from '${manifest.name}/flow-graph';\n`
    + `import * as marking from '${manifest.name}/marking';\n`
    + `import * as receipts from '${manifest.name}/receipts';\n`
    + `import * as ids from '${manifest.name}/process/element-ids';\n`
    + `import {ok, err, type ActionResult} from '${manifest.name}/result';\n`
    + `const success:ActionResult<number>=ok(3); if(!success.ok || success.data!==3 || err('held').ok) throw new Error('Changed result contract');\n`
    + `import {OUTCOME_DISPOSITIONS, RETRY_POSTURE, isVerdict, isNonVerdict, countsAsFailure, isOutcomeDisposition} from '${manifest.name}/outcome-disposition';\n`
    + `if(JSON.stringify(OUTCOME_DISPOSITIONS)!==JSON.stringify(['proceed','awaiting-person','awaiting-input','inconclusive','refused'])) throw new Error('Changed disposition vocabulary');\n`
    + `for(const state of ['awaiting-person','awaiting-input','inconclusive'] as const) if(isVerdict(state)||!isNonVerdict(state)||countsAsFailure(state)) throw new Error('Non-verdict became a verdict/failure');\n`
    + `if(RETRY_POSTURE['awaiting-person']!=='never'||RETRY_POSTURE.inconclusive!=='same-input'||!countsAsFailure('refused')||isOutcomeDisposition('failed')) throw new Error('Changed retry or closed outcome semantics');\n`
    + `if(root.buildShapeFlowGraph !== graph.buildShapeFlowGraph || root.stepDriveMarking !== marking.stepDriveMarking || root.isCompletingWorkroomDriveReceiptAt !== receipts.isCompletingWorkroomDriveReceiptAt) throw new Error('Competing public implementations');\n`
    + `if(ids.stageElementId('verify') !== 'stage:verify') throw new Error('Changed durable element identity');\n`);
  await writeFile(join(consumer, "tsconfig.json"), JSON.stringify({ compilerOptions: {
    target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext", strict: true,
    types: [], skipLibCheck: false, noEmitOnError: true, outDir: "dist", rootDir: "src",
  }, include: ["src/**/*.ts"] }));
  run(process.execPath, [join(root, "node_modules/typescript/bin/tsc"), "--project", join(consumer, "tsconfig.json")], consumer);
  run(process.execPath, [join(consumer, "dist/exports.js")], consumer);
  run(process.execPath, ["--input-type=module", "--eval", `
    for (const path of ['${manifest.name}/packages/validators/src/workroom/index.ts', '${manifest.name}/dist/workroom/index.js', '${manifest.name}/process/constructs-used-by']) {
      try { await import(path); throw new Error('Undeclared package path admitted'); }
      catch (error) { if(error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error; }
    }
  `], consumer);
  const output = run(process.execPath, ["--input-type=module", "--eval", "const {runSmoke}=await import('./dist/smoke.js'); console.log(JSON.stringify(runSmoke()));"], consumer);
  const result = JSON.parse(output);
  assert.equal(result.qualification, "synthetic-only");
  assert.equal(result.passed.length, 13, "Exercise every existing ordinary/adverse protocol case against the installed package");
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await inspect(path);
      else if (/\.(?:js|ts)$/.test(entry.name)) {
        const text = await readFile(path, "utf8");
        for (const match of text.matchAll(/(?:from\s*|import\s*\()(["'])([^"']+)\1/g)) {
          assert(!match[2].endsWith(".ts"), `Unusable emitted source import: ${path}: ${match[2]}`);
          if (match[2].startsWith(".")) assert((await lstat(resolve(dirname(path), match[2]))).isFile(), `Missing emitted dependency: ${match[2]}`);
        }
      }
    }
  }
  await inspect(join(installed, "dist"));
  console.log(JSON.stringify({ package: `${manifest.name}@${manifest.version}`, tarballSha256: createHash("sha256").update(await readFile(tarball)).digest("hex"), installedConsumer: "pass", declarations: "pass", cases: result.passed, qualification: "synthetic-only", productionConformance: false }, null, 2));
} finally {
  await rm(temp, { recursive: true, force: true });
}
