export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Citation System Entrypoint",
    alias: "CitationSystem.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
