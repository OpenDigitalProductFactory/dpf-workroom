# Migration and release boundary

1. Bootstrap with exact public upstream sources and original isolated examples. Verify every imported byte and retain notices. This step creates a source home only.
2. Maintain the declared component responsibility here. Resolve shared graph, vocabulary and canonical-JSON ownership in DEPENDENCY-BOUNDARY.json before editing shared semantics or publishing a consuming release. Do not create cycles, a second work engine or competing serializers to avoid a dependency.
3. Produce a versioned package interface and full dependency closure after the source identity baseline passes. Characterize old and new input, output, digest, receipt, canonicalization, loader and emitted-module behavior. Unsupported formats refuse; missing data never becomes authority.
4. Migrate each actual DPF/DPF2 caller through its existing governed lifecycle. In that same accepted slice retire only replaced source/snapshots and record compatibility consumers and their removal condition. No source in either consumer changes merely because this repository exists.
5. A release must have an accountable maintainer, compatibility policy, security reporting path, exact check evidence and received useful outcome where applicable. Native or production claims need their actual qualification. Do not fabricate upstream integration/browser results or inherit them from a merge.

These are migration obligations, not extra per-tool human approvals. Ordinary authorized checks and independent review retain their current meaning; actual required human consent remains distinct.

## Candidate adoption and rollback

The `0.1.0-candidate.2` packaging slice changes exports/build output, not any
seeded domain source or its provenance. The canonical ownership selected in
DPF's reviewed cutover plan (PR #6797, DI-7AF2A4D33ED0) places the graph,
marking, receipts, result and pure process leaves here. GPP and scoped judgment
retain their separate responsibilities. Other seeded compatibility snapshots
remain frozen until their downward dependency and same-slice retirement lands.

Receiving work must pin an exact reviewed artifact revision and tarball integrity,
then replace actual imports. DPF's first cutover is the existing Workroom
shape-conformance caller plus its compatibility imports; DPF2's receiving slice
uses the graph/reachability exports and retires its displaced graph copy. This
candidate does not supply `gppShapeDocumentSchema`: that belongs to the GPP
artifact, and a graph package cannot substitute for its schema qualification.

Run consumer typechecks, behavior/identity/receipt parity, emitted imports and
recovery against the exact candidate. Preserve current host fixes and retire
only displaced implementation bodies. Roll back the dependency pin and its
coupled caller/import change together. This packaging slice adds no persistence
or migration and cannot authorize rewriting in-flight records or receipts.

Component source/build review and DCO PR/CI happen in this repository. Actual
DPF and DPF2 acceptance happens in each consumer's process. Local tarball checks
are not release approval, installed-product acceptance, or native qualification.

Candidate `.2` corrects only version/runtime-engine metadata: strict installation
is supported on the two tested Node versions, 24.16.0 and 24.22.0. The build
stays pinned to 24.16.0/TypeScript 6.0.3. Pure source/API semantics are unchanged;
prior `.0` and `.1` archives remain immutable. The receiving matrix is Darwin
arm64 and does not qualify a product, actual browser/CSP or Linux enforcement.
