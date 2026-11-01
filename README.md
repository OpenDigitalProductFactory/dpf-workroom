# dpf-workroom

Portable Workroom graph, marking and receipt kernel.

A separate component source home for DPF and the DPF2 Linux business-appliance destination. This initial commit seeds the exact merged extraction; it is not a production-qualified library release or an OS service.

## Source and verification

Source: [56f3a5d2d57d](https://github.com/OpenDigitalProductFactory/opendigitalproductfactory/tree/56f3a5d2d57d751eb3ac435dcca4133c5ff46686), merged by [PR #6724](https://github.com/OpenDigitalProductFactory/opendigitalproductfactory/pull/6724). `PROVENANCE.json` pins every imported file to its original Git blob and SHA-256. Apache-2.0 license and original notices are retained; component-specific notice is in `examples/workroom-kernel/NOTICE`.

Use Node **24.16.0**. Run `npm ci --ignore-scripts`, then `npm run check`. The pinned TypeScript **6.0.3** compiler builds and executes the original isolated consumer in a temporary directory. No DPF checkout, database, Docker, provider credential or model inference is needed. [workroom-kernel example](examples/workroom-kernel/README.md) explains its supported semantics and limits. Relative `.ts` imports are emitted with standard extension rewriting.

No package is published: `private:true` prevents accidental npm publication. Browser/native/professional qualification and useful company outcomes require the actual receiving implementation. Source checks and fixture smoke tests cannot establish them.

## Ownership and migration

This repository owns the candidate component's evolution. The files remain in their original relative source layout for an auditable move-only bootstrap. `DEPENDENCY-BOUNDARY.json` identifies shared frozen compatibility sources. They must not become independent forks; first consuming release requires one canonical package owner and removal of displaced snapshots after parity. Existing DPF and DPF2 consumers are unchanged.

See [MIGRATION.md](MIGRATION.md) for the transition and [CONTRIBUTING.md](CONTRIBUTING.md) for maintenance. Separate Git ownership does not imply another process, database, permission system or deployment. Company, Workroom, GPP/TAK, GAID/JSI, current admission and transactional effect/result owners retain their authority.

## Installed candidate contract

`0.1.0-candidate.2` adds an ESM package build and declarations over the unchanged
seeded kernel. It remains private and unpublished. `npm run build` emits the
portable closure into `dist`; `npm pack` builds a local tarball. No DPF checkout,
application boot, database, provider credential or runtime dependency is needed.

The root export provides the graph, marking and receipt kernel. Supported
subpaths are `flow-graph`, `marking`, `receipts`, `result`, `outcome-disposition`, and
`process/{element-ids,diagnostics,executable-constructs}` under
`@opendigitalproductfactory/dpf-workroom`. These exports resolve to the same
implementation bodies. Source-layout and `dist` deep imports are sealed.
`constructs-used-by` analysis belongs to GPP and is not emitted or exported by
this package; its seeded provenance snapshot remains frozen pending migration.

```js
import { buildShapeFlowGraph, forwardReach } from "@opendigitalproductfactory/dpf-workroom";
```

`npm run test:package` packs the built candidate, installs it into a fresh
temporary consumer, typechecks it with the pinned compiler, and runs all 13
original ordinary/adverse protocol scenarios against the installed package.
The receiver uses no kernel source copies, workspace aliases or package
symlinks. The check also verifies public-export identity and the complete emitted
runtime/declaration import closure. The build rewrites declaration import nodes
to `.js`; original upstream source/provenance remains byte-identical.

Supported build/receiving profile: Node 24.16.0, ESM/NodeNext and TypeScript 6.0.3.
CommonJS, alternate runtimes/compiler versions, browser/native hosts, complete
GPP schema/compiler behavior and production effects are not qualified here.
The synthetic host demonstrates contracts; it does not enforce real OS, tenant,
authentication or business authority.

Upstream qualification limit: Synthetic protocol fixture and installed artifact
contract only; no execution, authentication, enforcement or business qualification.

Candidate `.1` also extracts the existing import-free outcome-disposition
contract assigned here by the reviewed ownership plan. Its original upstream
blob and SHA-256 are added to PROVENANCE.json; the original 21 entries remain
unchanged. Installed tests preserve the closed vocabulary, distinguish waits and
inconclusive results from verdicts/failures, and preserve retry posture.
Candidate `.0` remains an immutable prior artifact, not an overwritten release.

Candidate `.2` corrects only version/runtime-engine metadata: strict installation
is supported on the two tested Node versions, 24.16.0 and 24.22.0. The build
stays pinned to 24.16.0/TypeScript 6.0.3. Pure source/API semantics are unchanged;
prior `.0` and `.1` archives remain immutable. The receiving matrix is Darwin
arm64 and does not qualify a product, actual browser/CSP or Linux enforcement.
